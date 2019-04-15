import { Wallet } from "ethers";
export declare class UsernameRegistryContract {
    static deploy(wallet: Wallet): Promise<string>;
    private static getBytecode;
    private static getAbi;
}
