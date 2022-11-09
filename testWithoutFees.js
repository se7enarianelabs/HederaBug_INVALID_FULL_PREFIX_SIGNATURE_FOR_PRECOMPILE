const { ContractCreateFlow, AccountId, PrivateKey, Client, Hbar, HbarUnit, ContractExecuteTransaction, ContractFunctionParameters} = require("@hashgraph/sdk");
const fs = require("fs");
const { parse } = require("dotenv");
require("dotenv").config();
const {HederaAccount} = require("./HederaAccount");
const {HederaNFT} = require("./HederaNFT");
const { getByteCode } = require("./HederaContractDeployer");

const bytecode = getByteCode("./build/contracts/TestContract.json");
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const treasury = new HederaAccount(operatorId, operatorKey)

const CONTRACT_ID = "0.0.48823055";
async function main(){
    const nft = await (new HederaNFT().createNFT(operatorId, operatorKey));
    const maker = await (new HederaAccount().createAccount(Hbar.from(100, HbarUnit.Hbar).toTinybars()));
    const taker = await (new HederaAccount().createAccount(Hbar.from(100, HbarUnit.Hbar).toTinybars()));
    await maker.tokenAssociate(nft.tokenId, client);
    await maker.approveHBAR(CONTRACT_ID, 100000, client);
    await taker.approveHBAR(CONTRACT_ID, 100000, client);
    await taker.tokenAssociate(nft.tokenId, client);

    await maker.setApprovalForAll(nft.tokenId,CONTRACT_ID);
    await taker.setApprovalForAll(nft.tokenId, CONTRACT_ID);

    const serialNumber = await nft.mintNFT();
    await treasury.transferNFT(nft.tokenId, serialNumber, maker.accountId);
    await test(nft.tokenSolidityAddress, maker.evmAddress, taker.evmAddress, serialNumber);

}

async function test(token, owner, to, tokenId){
    const executeTransaction = await new ContractExecuteTransaction()
    .setContractId(CONTRACT_ID)
    .setGas(10000000)
    .setFunction("_transferERC721AssetFrom", new ContractFunctionParameters()
        .addAddress(token)
        .addAddress(owner)
        .addAddress(to)
        .addUint256(tokenId))
    .setMaxTransactionFee(new Hbar(2));

const response = await executeTransaction.execute(client);

const receipt = await response.getReceipt(client);
const record = await response.getRecord(client);
}




main();