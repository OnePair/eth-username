# Eth-Username

> An Ethereum decentralized username smart contract implementation and library.

## Install

Install npm.

`npm install ./eth-username/`

## Build

`npm run build`

## Usage

1. Setup
	```javascript
    import { JsonRpcProvider } from "ethers/providers"
    import { EthUsername } from "eth-username";
    import { Wallet } from "ethers";

    // 1) Connect to IPFS
    EthUsername.connectToIpfs("IPFS-NODE");

    // 2) Connect to an Ethereum node
    let ethProvider = new JsonRpcProvider("ETH-NODE");

    // 3) Create an Ethereum wallet
    let wallet = Wallet.createRandom().connect(ethProvider);

    // 4) Connect to the Ropsten testnet
    let ethUsername = await EthUsername.load(wallet, EthUsername.ROPSTEN_TESTNET);

    // 5) Fund the address
    ```
2. Register a username
	```javascript
	let username = "user1";
    let profile = {firstName: "user1"};

	let transaction = await ethUsername.registerUsername(username, profile);

    console.log("tx address:", transaction.hash);
    ```
3. Get a user profile
	```javascript
    let profile = await ethUsername.getProfile(username);
    ```

## Deploy a test contract

```javascript
import { UsernameRegistryContract } from "eth-username";

let contractAddress = await UsernameRegistryContract.deploy(wallet);

// Connect to that contract
let ethUsername = await EthUsername.load(wallet, EthUsername.LOCAL_TESTNET, {contractAddress: contractAddress});
```

## Test

`npm run test`