use fuels::{prelude::*, types::*};

// Load abi from json
abigen!(Contract(
    name = "SimpleVrf",
    abi = "out/debug/simplevrf-fuel-abi.json"
),
Contract(
    name = "SampleVrfContract",
    abi = "../simplevrf-fuel-example/out/debug/simplevrf-fuel-example-abi.json"
));

async fn get_contract_instance() -> (SimpleVrf<WalletUnlocked>, SampleVrfContract<WalletUnlocked>, ContractId, Address) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();
    let pubkey = wallet.address();

    let id = Contract::load_from(
        "./out/debug/simplevrf-fuel.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let sample_vrf_id = Contract::load_from(
        "../simplevrf-fuel-example/out/debug/simplevrf-fuel-example.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = SimpleVrf::new(id.clone(), wallet.clone());
    let sample_vrf_instance = SampleVrfContract::new(sample_vrf_id.clone(), wallet.clone());

    (instance, sample_vrf_instance, id.into(), pubkey.into())
}

#[tokio::test]
async fn simple_vrf_e2e_test() {
    let (vrf, sample, id, pubkey) = get_contract_instance().await;
    println!("vrf: {:?}", vrf.contract_id());
    println!("sample: {:?}", sample.contract_id());
    println!("pubkey: {:?}", pubkey);

    // set the vrf contract id in the example contract
    sample.methods().set_vrf_id(id).call().await.unwrap();

    // set assets and fee in the example contract
    vrf.methods().set_fee(AssetId::default(), 10000).call().await.unwrap();
    let fees = vrf.methods().get_fee(AssetId::default()).call().await.unwrap();
    assert_eq!(fees.value, 10000);
    println!("fees: {:?}", fees.value);

    vrf.methods().add_authority(pubkey).call().await.unwrap();

    let seed = Bits256([1; 32]);
    let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";
    let proof = Bits256::from_hex_str(hex_str).unwrap();

    // generate request to the vrf contract
    sample.methods().request(seed)
    .call_params(
        CallParameters::default().with_amount(300000).with_asset_id(AssetId::default())
    )
    .unwrap()
    .with_contract_ids(&[vrf.contract_id().clone()])
    .call().await.unwrap();

    let counter = vrf.methods().get_request_count().call().await.unwrap();

    assert_eq!(counter.value, 1);

    vrf.methods().get_request(seed).call().await.unwrap();

    // submit proof to the vrf contract
    vrf.methods().submit_proof(seed, proof).with_contract_ids(&[sample.contract_id().clone()]).call().await.unwrap();

    let checker = sample.methods().get_latest_proof().call().await.unwrap();
    assert_eq!(checker.value, proof);
}