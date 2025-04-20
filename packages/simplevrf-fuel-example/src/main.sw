contract;

use simplevrf_fuel_abi::{SimpleVrf, SimpleVrfCallback};
use std::constants::{ZERO_B256};
use std::address::Address;

abi SampleVrfContract {
    #[storage(read, write)]
    fn simplevrf_callback(seed: b256, proof: b256);

    #[storage(read, write)]
    fn request(seed: b256) -> u64;

    #[storage(read)]
    fn get_latest_proof() -> b256;

    #[storage(read)]
    fn get_seed() -> b256;

    #[storage(read, write)]
    fn set_vrf_id(vrf_id: ContractId);

}

storage {
    latest_proof: b256 = ZERO_B256,
    seed: b256 = ZERO_B256,
    vrf_id: b256 = ZERO_B256
}

impl SimpleVrfCallback for Contract {
    #[storage(read, write)]
    fn simple_callback(seed: b256, proof: b256) {
        storage.latest_proof.write(proof);
    }
}

impl SampleVrfContract for Contract {
    #[storage(read, write)]
    fn simplevrf_callback(seed: b256, proof: b256) {
        storage.latest_proof.write(proof);
    }

    #[storage(read, write)]
    fn request(seed: b256) -> u64 {
        let vrf_id = storage.vrf_id.try_read().unwrap();
        storage.seed.write(seed);
        let simple_vrf = abi(SimpleVrf, vrf_id);
        let request_id = simple_vrf.request(seed);
        request_id
    }

    #[storage(read)]
    fn get_latest_proof() -> b256 {
        storage.latest_proof.try_read().unwrap()
    }

    #[storage(read)]
    fn get_seed() -> b256 {
        storage.seed.try_read().unwrap()
    }

    #[storage(read, write)]
    fn set_vrf_id(vrf_id: ContractId) {
        storage.vrf_id.write(vrf_id.bits());
    }
}