contract;

use std::auth::msg_sender;
use std::storage::*;
use std::storage::storage_vec::*;
use std::address::Address;
use std::assert::assert;
use std::context::*;
use std::identity::Identity;
use std::constants::{ZERO_B256};
use std::block::height;

const ADMIN_ADDRESS: Address = Address::from(0x2a8d96911becbe05b2a9f5253c91865f0f4b365ed0e2abab17a35e9fc9c4ac76);

pub enum Error {
    NotAuthorized: (),
    InsufficientFee: (),
    ProofNotFound: (),
    RequestNotFound: (),
    ContractCallNotAllowed: (),
}

// Helpers
fn is_authority() -> bool {
    let sender = msg_sender().unwrap();
    require(sender.is_address(), Error::ContractCallNotAllowed);
    sender.as_address().unwrap() == ADMIN_ADDRESS
}

fn pseudo_random(seed: u64) -> u64 {
    // Simple hash-style mix
    (seed ^ 0x5bf03635ca3e2901) * 6364136223846793005
}

abi SimpleVrfCallback {
    fn simple_callback(seed: b256, proof: b256);
}

abi SimpleVrf {
    #[storage(read)]
    fn get_fee(asset: AssetId) -> u64;

    #[storage(read, write)]
    fn set_fee(asset: AssetId, fee: u64);

    #[storage(read)]
    fn get_request_count() -> u64;

    #[storage(read)]
    fn get_request(seed: b256) -> Request;

    #[storage(read)]
    fn get_request_by_num(num: u64) -> Request;

    #[storage(read)]
    fn get_authorities() -> Vec<Address>;

    #[storage(read, write)]
    fn add_authority(authority: Address);

    #[storage(read, write)]
    fn remove_authority(authority: Address);

    #[payable]
    #[storage(read, write)]
    fn request(seed: b256) -> u64;

    #[storage(read, write)]
    fn submit_proof(seed: b256, proof: b256) -> bool;
}

struct Request {
    num: u64,
    status: u64, // 0 = pending, 1 = executed, 2 = failed
    seed: b256,
    proof: b256,
    callback_contract: Identity,
}

// Storage definitions
storage {
    fee_map: StorageMap<AssetId, u64> = StorageMap {},
    request_count: u64 = 0,
    authorities: StorageVec<Address> = StorageVec {},
    requests: StorageMap<b256, Request> = StorageMap {},
    request_num: StorageMap<u64, b256> = StorageMap {},
    proofs: StorageMap<b256, StorageVec<b256>> = StorageMap {},
}



// Implementation
impl SimpleVrf for Contract {

    #[storage(read)]
    fn get_request(seed: b256) -> Request {
        storage.requests.get(seed).try_read().unwrap()
    }

    #[storage(read)]
    fn get_request_by_num(num: u64) -> Request {
        let seed = storage.request_num.get(num).try_read().unwrap();
        storage.requests.get(seed).try_read().unwrap()
    }

    #[storage(read)]
    fn get_fee(asset: AssetId) -> u64 {
        storage.fee_map.get(asset).try_read().unwrap()
    }

    #[storage(read, write)]
    fn set_fee(asset: AssetId, fee: u64) {
        require(is_authority(), Error::NotAuthorized);
        storage.fee_map.insert(asset, fee);
    }

    #[storage(read)]
    fn get_request_count() -> u64 {
        storage.request_count.try_read().unwrap()
    }

    #[storage(read)]
    fn get_authorities() -> Vec<Address> {
        let mut result = Vec::new();
        let len = storage.authorities.len();
        let mut i = 0;
        while i < len {
            result.push(storage.authorities.get(i).unwrap().try_read().unwrap());
            i = i + 1;
        }
        result
    }

    #[storage(read, write)]
    fn add_authority(authority: Address) {
        require(is_authority(), Error::NotAuthorized);
        let len = storage.authorities.len();
        let mut found = false;
        let mut i = 0;
        while i < len {
            if storage.authorities.get(i).unwrap().try_read().unwrap() == authority {
                found = true;
                break;
            }
            i = i + 1;
        }
        if !found {
            storage.authorities.push(authority);
        }
    }

    #[storage(read, write)]
    fn remove_authority(authority: Address) {
        require(is_authority(), Error::NotAuthorized);
        let len = storage.authorities.len();
        let mut i = 0;
        while i < len {
            if storage.authorities.get(i).unwrap().try_read().unwrap() == authority {
                let _ = storage.authorities.swap_remove(i);
                break;
            }
            i = i + 1;
        }
    }

    #[payable]
    #[storage(read, write)]
    fn request(seed: b256) -> u64 {
        let sender = msg_sender().unwrap();
        let count = storage.request_count.try_read().unwrap();
        let request = Request {
            num: count,
            seed: seed,
            status: 0,
            proof: ZERO_B256,
            callback_contract: sender,
        };
        storage.requests.insert(seed, request);
        storage.request_count.write(count + 1);
        storage.request_num.insert(count + 1, seed);
        count + 1
    }

    #[storage(read, write)]
    fn submit_proof(seed: b256, proof: b256) -> bool {
        let sender = msg_sender().unwrap();
        require(sender.is_address(), Error::ContractCallNotAllowed);
        let sender_addr = sender.as_address().unwrap();
        let mut i = 0;
        let len = storage.authorities.len();
        while i < len {
            if storage.authorities.get(i).unwrap().try_read().unwrap() == sender_addr {
                storage.proofs.get(seed).push(proof);
                break;
            }
            i = i + 1;
        }
        let proof_count = storage.proofs.get(seed).len();
        let quorum = (len * 2) / 3 + 1;
        if (proof_count >= quorum) {
            let block = height().as_u64();
            let local_seed = pseudo_random(block);
            let winner_index = local_seed % proof_count;
            // select a winner
            let winner_proof = storage.proofs.get(seed).get(winner_index).unwrap().try_read().unwrap();
            let request = storage.requests.get(seed).try_read().unwrap();
             // update the request status
            storage.requests.get(seed).write(Request {
                num: request.num,
                seed: request.seed,
                status: 1,
                proof: winner_proof,
                callback_contract: request.callback_contract,
            }); 
            // execute the callback
            let callback_contract = abi(SimpleVrfCallback, request.callback_contract.bits());
            let _ = callback_contract.simple_callback(seed, winner_proof);
          
        }
        true
    }

}

