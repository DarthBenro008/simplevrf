library;

pub struct ChunkedProof {
    pub p1: b256,
    pub p2: b256,
    pub p3: b256,
    pub p4: u8,
    pub proof: b256,
}

pub struct Request {
    pub num: u64,
    pub status: u64, // 0 = pending, 1 = executed, 2 = failed
    pub seed: b256,
    pub proof: ChunkedProof,
    pub callback_contract: Identity,
}

abi SimpleVrfCallback {
    #[storage(read, write)]
    fn simple_callback(seed: b256, proof: b256);
}

abi SimpleVrf {
    #[storage(read)]
    fn get_unfinalized_requests() -> Vec<Request>;

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
    fn submit_proof(seed: b256, proof: ChunkedProof) -> bool;
}