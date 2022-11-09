INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE Bug
---
## Description
When calling the contract function `contracts/TestContract.sol:7` on a HTS Token without
custom fixed fees, the call is successful(see testWithoutFees.js), 
when calling the same function with on a HTS with custom fees, we get a `CONTRACT_REVERT_EXECUTED` with `INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE` 
https://hashscan.io/testnet/transaction/0.0.47753807-1667979815-999391004?t=1667979824.298123003
(see testWithFees.js)

## Requirements
For development, you will only need Node.js and a node global package, ``npm``, installed in your environement.

## Installing and running

### env
```
NETWORK=TESTNET
MY_ACCOUNT_ID=<client account id>
MY_PRIVATE_KEY=<client private key>
```

### Test

    npm install
    node testWithFees.js 
    node testWithoutFees.js 




