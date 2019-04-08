import { expect, assert } from "chai";
import { JsonRpcProvider, Provider } from "ethers/providers";
import { Wallet } from "ethers";

import ganache from "ganache-cli";
import EthUsername from "../eth-username";
import UsernameRegistryContract from "../contract/username-registry-contract";
import Web3 from "web3";

describe("Testing eth-username", async () => {
  const IPFS_HOST = "/ip4/127.0.0.1/tcp/5001";
  const RPC_HOST = "http://127.0.0.1:9545";

  const USER1 = "user1";
  const USER2 = "user2";

  const USER1_PROFILE = { name: "user1" };
  const USER1_PROFILE2 = { name: "user1", lastName: "last name" };

  const USER2_PROFILE = { name: "user2" };

  let ethServer: any;
  let rpcProvider: Provider;
  let web3: Web3;

  let user1Wallet: Wallet;
  let user2Wallet: Wallet;

  let usernameRegistryAddress: string;

  let ethUsername1: EthUsername;
  let ethUsername2: EthUsername;

  before(async () => {
    console.log("Connecting to ipfs...");
    EthUsername.connectToIpfs(IPFS_HOST);

    console.log("Creating test chain...");
    // Create the test ethereum network
    ethServer = ganache.server();
    ethServer.listen(9545);
    rpcProvider = new JsonRpcProvider(RPC_HOST);

    // Initialize the web3 provider
    web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));
    let accounts = await web3.eth.getAccounts();

    // Create the user wallets
    user1Wallet = Wallet.createRandom().connect(rpcProvider);
    user2Wallet = Wallet.createRandom().connect(rpcProvider);

    console.log("Funding user wallets...");

    // Fund the user accounts
    await web3.eth.sendTransaction({
      from: accounts[1],
      to: user1Wallet.address,
      value: '5002465260000000000'
    })

    await web3.eth.sendTransaction({
      from: accounts[1],
      to: user2Wallet.address,
      value: '5002465260000000000'
    });
  });

  describe("Deployment", () => {
    it("Should successfully deploy the username-registry contract", (done) => {
      assert.doesNotThrow(() => {
        UsernameRegistryContract.deploy(user1Wallet).then((address: string) => {
          usernameRegistryAddress = address;
          console.log("Contract address:", usernameRegistryAddress);
          done();
        }).catch((err) => {
          done(new Error(err));
        });
      });
    });
  });

  describe("Username registration", () => {
    before(async () => {
      ethUsername1 = await EthUsername.load(user1Wallet,
        EthUsername.LOCAL_TESTNET,
        { contractAddress: usernameRegistryAddress });

      ethUsername2 = await EthUsername.load(user2Wallet,
        EthUsername.LOCAL_TESTNET,
        { contractAddress: usernameRegistryAddress });
    });

    it("Should register a new username", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.registerUsername(USER1, USER1_PROFILE)
          .then((transaction: object) => {
            done();
            console.log("Transaction address:", transaction["hash"]);
          }).catch((err) => {
            done(new Error(err));
          });
      });
    });

    it("Should be denied from registering the same username", (done) => {
      assert.doesNotThrow(() => {
        ethUsername2.registerUsername(USER1, USER2_PROFILE)
          .then(() => {
            done(new Error("Should of been denied!"));
          }).catch(() => {
            done();
          });
      });
    });
  });

  describe("Username profile", () => {
    it("Should get the right profle", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.getProfile(USER1).then((profile: object) => {
          expect(profile).to.deep.equal(USER1_PROFILE);
          done();
        }).catch((err) => {
          done(new Error(err));
        });
      });
    });

    it("Should update the profile", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.updateProfile(USER1, USER1_PROFILE2).then((transaction) => {
          done();
          console.log("Transaction address:", transaction["hash"]);
        }).catch((err) => {
          done(new Error(err));
        });
      });
    });

    it("Should be denied from updating the profile", (done) => {
      assert.doesNotThrow(() => {
        ethUsername2.updateProfile(USER1, USER1_PROFILE2).then(() => {
          done(new Error("Should of been denied!"));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe("Username address", () => {
    it("Should transfer ownership to a new address", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.setUserAddress(USER1, user2Wallet.address).then((transaction: object) => {
          done();
          console.log("Transaction address:", transaction["hash"]);
        }).catch((err) => {
          done(new Error(err));
        });
      });
    });

    it("New owner should be able to update the profile", (done) => {
      assert.doesNotThrow(() => {
        ethUsername2.updateProfile(USER1, USER2_PROFILE).then((transaction) => {
          done();
          console.log("Transaction address:", transaction["hash"]);
        }).catch((err) => {
          done(new Error(err));
        });
      });
    });

    it("Old owner should be denied from updating the profile", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.updateProfile(USER1, USER1_PROFILE2).then(() => {
          done(new Error("Should of been denied!"));
        }).catch(() => {
          done();
        });
      });
    });

    it("Old owner should be denied from setting the user address", (done) => {
      assert.doesNotThrow(() => {
        ethUsername1.setUserAddress(USER1, user1Wallet.address).then(() => {
          done(new Error("Should of been denied!"));
        }).catch(() => {
          done();
        });
      });
    });
  });


  after(() => {
    ethServer.close();
  });
});
