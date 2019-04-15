import { Wallet } from "ethers";

import { UsernameRegistry } from "./username-registry";
import { IpfsProfileStore } from "./ipfs-profile-store";
import IPFSApi from "ipfs-http-client";

export class EthUsername {
  //public static MAINNET = "mainnet";
  public static ROPSTEN_TESTNET = "rospten";
  public static LOCAL_TESTNET = "local-test";

  public static ipfsApi: IPFSApi;

  private static NETWOR_ADDRESS_MAP: object = {
    [EthUsername.ROPSTEN_TESTNET]: "0xbd79f93bb38e3a9ebeeb3781d855523e99533fa1"
  };

  private wallet: Wallet;
  private usernameRegistry: UsernameRegistry;

  constructor(usernameRegistry: UsernameRegistry, wallet: Wallet) {
    this.usernameRegistry = usernameRegistry;
    this.wallet = wallet;
  }

  public registerUsername(username: string, profile: object): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let userAddress = await this.wallet.getAddress();
        let profileAddress = await IpfsProfileStore.storeProfile(profile);
        let transaction
          = await this.usernameRegistry.registerUsername(username, userAddress, profileAddress);
        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  }

  public getProfile(username: string): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let profileAddress = await this.usernameRegistry.getProfileAddress(username);

        let profile = IpfsProfileStore.getProfile(profileAddress);
        onSuccess(profile);
      } catch (err) {
        onError(err);
      }
    });
  }

  public setUserAddress(username: string, userAddress: string): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let transaction = await this.usernameRegistry.setUserAddress(username, userAddress);
        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  };

  public updateProfile(username: string, profile: object): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let profileAddress = await IpfsProfileStore.storeProfile(profile);
        let transaction = await this.usernameRegistry.setProfileAddress(username, profileAddress);

        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  };

  public static load(wallet: Wallet, network: string,
    options?: object): Promise<EthUsername> {
    return new Promise<EthUsername>(async (onSuccess: Function, onError: Function) => {
      try {
        let contractAddress: string;
        if (options && ("contractAddress" in options))
          contractAddress = options["contractAddress"];
        else
          contractAddress = EthUsername.NETWOR_ADDRESS_MAP[network];
        //let wallet = new Wallet(privateKey, provider);

        let usernameRegistry = await UsernameRegistry.load(contractAddress, wallet);

        onSuccess(new EthUsername(usernameRegistry, wallet));
      } catch (err) {
        onError(err);
      }
    });
  }

  /*
  * Connect to an ipfs node.
  *
  * @param {string} apiUrl The api url if the ipfs node.
  */
  public static connectToIpfs(apiUrl: string): void {
    if (EthUsername.ipfsApi == undefined)
      EthUsername.ipfsApi = IPFSApi(apiUrl);
  }
}
