const { ContractCreateFlow, AccountId, PrivateKey, Client} = require("@hashgraph/sdk");
const fs = require("fs");
const { parse } = require("dotenv");
require("dotenv").config();


const bytecode = getByteCode("./build/contracts/TestContract.json");
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
async function main(){
    const contractCreate = new ContractCreateFlow()
        .setGas(100000)
        .setBytecode(bytecode);
    const txResponse = contractCreate.execute(client);
    const receipt = (await txResponse).getReceipt(client);
    const newContractId = (await receipt).contractId;
    console.log("The new contract ID is " +newContractId);
}

function getByteCode(path) {
    const file = fs.readFileSync(path);
    const parsedFile = JSON.parse(file);
    return parsedFile.bytecode;
}

main();