import { BN, bn, getRandomB256, Provider, WalletUnlocked } from "fuels";
import { SimplevrfFuelExample, SimplevrfFuel } from "./sway-contracts-api";
import type { ContractIdInput } from "./sway-contracts-api/contracts/SimplevrfFuelExample";



async function main() {
    const ETH_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
    const provider = new Provider("https://testnet.fuel.network/v1/graphql");
    const wallet = new WalletUnlocked(
        process.env.WALLET_SECRET ?? "",
        provider
    );
    const example = new SimplevrfFuelExample(process.env.SAMPLE ?? "", wallet)
    const vrf = new SimplevrfFuel(process.env.SIMPLEVRF_CONTRACT_ID ?? "", wallet)

    // set vrf id
    // const vrfIdInput: ContractIdInput = {
    //     bits: process.env.SIMPLEVRF_CONTRACT_ID ?? ""
    // }
    // const vrfId = await example.functions.set_vrf_id(vrfIdInput).call();
    // const vrfIdResult = await vrfId.waitForResult();
    // console.log("vrfId", vrfIdResult.transactionId)

    // make a request
    const random = getRandomB256()
    const request = await example.functions
    .request(random)
    .callParams({
        forward: [new BN(1200), ETH_ASSET_ID]
    })
    .addContracts([vrf])
    .call();
    const requestResult = await request.waitForResult();
    console.log("request", requestResult.transactionId)

    // poll on data
    setInterval(async () => {
        console.log("polling...")
        const data = await example.functions.get_latest_proof().get();
        console.log("data", data.value)
    }, 1000)

}

main().catch(console.error);