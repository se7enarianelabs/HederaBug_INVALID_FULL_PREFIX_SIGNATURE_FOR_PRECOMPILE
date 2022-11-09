require('dotenv').config()
const fs = require("fs");
const {
    FileCreateTransaction,
    FileAppendTransaction,
    Hbar,
    ContractCreateTransaction, ContractCreateFlow
} = require("@hashgraph/sdk");


function getByteCode(path) {
    const file = fs.readFileSync(path);
    const parsedFile = JSON.parse(file);
    return parsedFile.bytecode;
}

function getABI(path) {
    const file = fs.readFileSync(path);
    const parsedFile = JSON.parse(file);
    return parsedFile.abi;
}

async function deployContract(
    clientWrapper,
    byteCode,
    contractFunctionParameters
) {
    //Create the transaction
    const transaction = new ContractCreateFlow()
        .setGas(4000000)
        .setBytecode(byteCode)
        .setConstructorParameters(contractFunctionParameters);


    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = await transaction.execute(clientWrapper.client);

    //Get the receipt of the transaction
    return await txResponse.getReceipt(clientWrapper.client);
}

module.exports = { deployContract, getByteCode, getABI }
