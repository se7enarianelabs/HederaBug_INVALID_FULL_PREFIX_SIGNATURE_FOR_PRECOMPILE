const {Hbar, HbarUnit, PrivateKey, TransferTransaction, AccountInfoQuery, TokenAssociateTransaction, AccountBalanceQuery,
    AccountAllowanceApproveTransaction, AccountCreateTransaction
} = require("@hashgraph/sdk");
const {getClient} = require("./HederaClient");
const ethers = require("ethers");

class HederaAccount {



    constructor(accountId, privateKey) {
        this.accountId = accountId;
        this.privateKey = privateKey;
        return this;
    }

    async createAccount(balance= Hbar.from(10, HbarUnit.Hbar).toTinybars(), client = getClient()) {        
        const privateKey = PrivateKey.generateED25519();
        const publicKey = privateKey.publicKey;
        const tx = await new AccountCreateTransaction()
            .setKey(privateKey)
            .setInitialBalance(Hbar.fromTinybars(balance))
            .execute(client);

        const txResponse = await tx.getReceipt(client);
        this.accountId = txResponse.accountId;
        this.privateKey = privateKey;
        this.evmAddress = this.accountId.toSolidityAddress();
        return this;
    }

    async tokenAssociate(tokenId, client = getClient()){
        const transaction = await new TokenAssociateTransaction()
            .setAccountId(this.accountId)
            .setTokenIds([tokenId])
            .freezeWith(client);

        const signTx = await transaction.sign(this.privateKey);
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        const transactionStatus = receipt.status;
        console.log("The transaction consensus status " +transactionStatus.toString());
    }
    async setApprovalForAll(tokenId, spenderId, client = getClient()) {
        //Create the transaction
        const transaction = new AccountAllowanceApproveTransaction()
            .approveTokenNftAllowanceAllSerials(tokenId, this.accountId, spenderId)
            .freezeWith(client);

        //Sign the transaction with the owner account key
        const signTx = await transaction.sign(this.privateKey);

        //Sign the transaction with the client operator private key and submit to a Hedera network
        const txResponse = await signTx.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Get the transaction consensus status
        const transactionStatus = receipt.status;

        console.log("The transaction consensus status is " +transactionStatus.toString());

    }

    async approveHBAR(spenderId, amount, client = getClient()) {
        //Create the transaction
        const transaction = new AccountAllowanceApproveTransaction()
            .approveHbarAllowance(this.accountId, spenderId, amount)
            .freezeWith(client);

        //Sign the transaction with the owner account key
        const signTx = await transaction.sign(this.privateKey);

        //Sign the transaction with the client operator private key and submit to a Hedera network
        const txResponse = await signTx.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Get the transaction consensus status
        const transactionStatus = receipt.status;

        console.log("The transaction consensus status is " +transactionStatus.toString());

    }

    async transferNFT(tokenId, serialNumber, receiverId, client = getClient()){
        //Create the transfer transaction
        const transaction = await new TransferTransaction()
            .addNftTransfer(tokenId, serialNumber, this.accountId, receiverId)
            .freezeWith(client);

        const signTx = await transaction.sign(this.privateKey);

        const txResponse = await signTx.execute(client);

        const receipt = await txResponse.getReceipt(client);

        const transactionStatus = receipt.status;

        console.log("The transaction consensus status " +transactionStatus.toString());

    }
}

module.exports = {HederaAccount}
