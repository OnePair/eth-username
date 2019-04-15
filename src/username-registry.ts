import { Wallet, Contract } from "ethers";

import * as fs from "fs";
import * as path from "path";

/*
* This is the smart contract client
*/
export class UsernameRegistry {
  private contract: Contract;

  constructor(contract: Contract) {
    this.contract = contract;
  }

  public registerUsername(username: string, userAddress: string,
    profileAddress: string): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);
        if (exists)
          throw new Error("Username already exists.");

        let transaction
          = await this.contract.registerUsername(username, userAddress, profileAddress);

        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  }

  public setUserAddress(username: string, userAddress: string): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);
        if (!exists)
          throw new Error("Username does not exist.");

        let transaction = await this.contract.setUserAddress(username, userAddress);

        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  }

  public setProfileAddress(username: string, profileAddress: string): Promise<object> {
    return new Promise<object>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);
        if (!exists)
          throw new Error("Username does not exist.");

        let transaction = await this.contract.setProfileAddress(username, profileAddress);

        onSuccess(transaction);
      } catch (err) {
        onError(err);
      }
    });
  }

  public getUserAddress(username: string): Promise<string> {
    return new Promise<string>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);
        if (!exists)
          throw new Error("Username does not exist.");

        let address = await this.contract.getUserAddress(username);

        onSuccess(address);
      } catch (err) {
        onError(err);
      }
    });
  }

  public getProfileAddress(username: string): Promise<string> {
    return new Promise<string>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);
        if (!exists)
          throw new Error("Username does not exist.");

        let address = await this.contract.getProfileAddress(username);

        onSuccess(address);
      } catch (err) {
        onError(err);
      }
    });
  }

  public usernameExists(username: string): Promise<boolean> {
    return new Promise<boolean>(async (onSuccess: Function, onError: Function) => {
      try {
        let exists = await this.contract.usernameExists(username);

        onSuccess(exists);
      } catch (err) {
        onError(err);
      }
    });
  }

  public static load(contractAddress: string, wallet: Wallet): Promise<UsernameRegistry> {
    return new Promise<UsernameRegistry>(async (onSuccess: Function, onError: Function) => {
      try {
        // load the contract
        let abi = UsernameRegistry.getAbi();
        let contract = new Contract(contractAddress, abi, wallet);

        onSuccess(new UsernameRegistry(contract));
      } catch (err) {
        onError(err);
      }
    });
  }

  private static getAbi(): Array<string | any> {
    let abi = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/abi.json")).toString());
    return abi;
  }
}
