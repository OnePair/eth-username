import { Wallet, ContractFactory } from "ethers";

import * as path from "path";
import * as fs from "fs";

export default class UsernameRegistryContract {

  public static deploy(wallet: Wallet): Promise<string> {
    return new Promise<string>(async (onSuccess: Function, onError: Function) => {
      try {

        let contractFactory = new ContractFactory(UsernameRegistryContract.getAbi(),
          UsernameRegistryContract.getBytecode(),
          wallet);
        let contract = await contractFactory.deploy();

        onSuccess(contract.address);
      } catch (err) {
        onError(err);
      }
    });
  }

  private static getBytecode(): string {
    let bytecode = JSON.parse(fs.readFileSync(path.join(__dirname, "./bytecode.json")).toString());
    return "0x" + bytecode["object"];
  }

  private static getAbi(): Array<string | any> {
    let abi = JSON.parse(fs.readFileSync(path.join(__dirname, "./abi.json")).toString());
    return abi;
  }
}
