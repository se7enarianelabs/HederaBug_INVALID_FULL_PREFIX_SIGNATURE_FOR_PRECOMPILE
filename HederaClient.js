const {AccountId, PrivateKey, Client} = require("@hashgraph/sdk");
require("dotenv").config();


function getTestnetClient(operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID),
                          operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY)) {
    return Client.forTestnet().setOperator(operatorId, operatorKey);
}

function getLocalClient(operatorId = AccountId.fromString(process.env.LOCAL_OPERATOR_ID),
                         operatorKey = PrivateKey.fromString(process.env.LOCAL_OPERATOR_KEY)) {
    const nodeAddress = process.env.LOCAL_NODE_ADDRESS;
    const node = {"127.0.0.1:50211": new AccountId(3)};
    const client = Client.forNetwork(node).setMirrorNetwork(process.env.LOCAL_MIRROR_NODE_ADDRESS);
    return client.setOperator(operatorId, operatorKey)
}

function getClient(operatorId, operatorKey) {
    switch (process.env.NETWORK) {
        case "TESTNET":
            return getTestnetClient(operatorId, operatorKey)
        case "LOCAL":
            return getLocalClient(operatorId, operatorKey)
    }
}

module.exports = {getClient}


