import { Wallet } from "ethers";
export default class UsernameRegistryContract {
    static deploy(wallet: Wallet): Promise<string>;
    private static getBytecode;
    private static getAbi;
}
