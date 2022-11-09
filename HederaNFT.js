const {getClient} = require("./HederaClient");
const {TokenCreateTransaction, Hbar, TokenType, TokenMintTransaction, CustomFixedFee} = require("@hashgraph/sdk");


function tokenCreateTransactionBuilder(adminAccountId, adminPrivateKey,
                              name="Test", symbol="T") {
    return new TokenCreateTransaction()
        .setTokenType(TokenType.NonFungibleUnique)
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTreasuryAccountId(adminAccountId)
        .setSupplyKey(adminPrivateKey)
        .setAdminKey(adminPrivateKey)
        .setMaxTransactionFee(new Hbar(1000));     //Change the default max transaction fee

}

class HederaNFT {

    async createNFT(adminAccountId, adminPrivateKey,
                    name="Test", symbol="T",client = getClient()) {
        //Create the transaction and freeze for manual signing
        const transaction = await tokenCreateTransactionBuilder(
            adminAccountId, adminPrivateKey, name, symbol)
            .freezeWith(client);

        const signTx =  await (await transaction.sign(adminPrivateKey));

        const txResponse = await signTx.execute(client);

        const receipt = await txResponse.getReceipt(client);

        const tokenId = receipt.tokenId;
        console.log("The new token ID is " + tokenId);

        this.tokenId = tokenId;
        this.tokenSolidityAddress = tokenId.toSolidityAddress();
        this.nftAmount = 0;
        this.adminKey = adminPrivateKey;
        this.supplyKey = adminPrivateKey;
        return this;
    }

    async createNFTWithFixedFallbackFees(adminAccountId, adminPrivateKey,
                                         feeAmount = 1,
                                         denominatingTokenId = null,
                                         feeCollectorAccountId = adminAccountId,
                                         name="Test", symbol="T",
                                         client = getClient()) {
        //Create the transaction and freeze for manual signing

        const transaction = await tokenCreateTransactionBuilder(
            adminAccountId, adminPrivateKey, name, symbol)
            .setCustomFees(
                [new CustomFixedFee()
                    .setAmount(feeAmount)
                    .setDenominatingTokenId(denominatingTokenId)
                    .setFeeCollectorAccountId(feeCollectorAccountId)]
            )
            .freezeWith(client);

        const signTx =  await (await transaction.sign(adminPrivateKey));

        const txResponse = await signTx.execute(client);

        const receipt = await txResponse.getReceipt(client);

        const tokenId = receipt.tokenId;
        console.log("The new token ID is " + tokenId);

        this.tokenId = tokenId;
        this.tokenSolidityAddress = tokenId.toSolidityAddress();
        this.nftAmount = 0;
        this.adminKey = adminPrivateKey;
        this.supplyKey = adminPrivateKey;
        return this;
    }



    async mintNFT(client = getClient()){
        //Mint another 1,000 tokens and freeze the unsigned transaction for manual signing
        const transaction = await new TokenMintTransaction()
            .setTokenId(this.tokenId)
            .addMetadata(Uint8Array.of(1,2,3))
            .freezeWith(client);

        const signTx = await transaction.sign(this.supplyKey);

        const txResponse = await signTx.execute(client);

        const receipt = await txResponse.getReceipt(client);

        const transactionStatus = receipt.status;

        console.log("The transaction consensus status " +transactionStatus.toString());

        return ++this.nftAmount;
    }
}

module.exports = {HederaNFT}
