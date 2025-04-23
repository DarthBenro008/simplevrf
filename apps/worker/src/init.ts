import { Address, Provider, WalletUnlocked, type AddressInput } from "fuels";
import { SimplevrfFuel } from "@simplevrf/sway-contracts-api";
import type { AssetIdInput } from "@simplevrf/sway-contracts-api/dist/contracts/SimplevrfFuel";

async function main() {
    const ETH_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
    const provider = new Provider("https://testnet.fuel.network/v1/graphql");
    const wallet = new WalletUnlocked(
        process.env.WALLET_SECRET ?? "",
        provider
    );

    const vrf = new SimplevrfFuel(process.env.SIMPLEVRF_CONTRACT_ID ?? "", wallet);

    // set fees
    const assetIdInput: AssetIdInput = {
        bits: ETH_ASSET_ID,
    }
    const fees = await vrf.functions.set_fee(assetIdInput, 1000).call();
    const feesResult = await fees.waitForResult();
    console.log("set fees", feesResult.transactionId)

    // set authorities
    // const addressInput = { bits: "0x790e198405236466f2760316697eaE3320982b1Af8BA2A2F7bd088a632fD66DF" }
    // const authorities = await vrf.functions.add_authority(addressInput).call();
    // const authoritiesResult = await authorities.waitForResult();
    // console.log("add authority", authoritiesResult.transactionId)

}

main().catch(console.error);