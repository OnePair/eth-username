import { Wallet, Contract } from "ethers";
export default class UsernameRegistry {
    private contract;
    constructor(contract: Contract);
    registerUsername(username: string, userAddress: string, profileAddress: string): Promise<object>;
    setUserAddress(username: string, userAddress: string): Promise<object>;
    setProfileAddress(username: string, profileAddress: string): Promise<object>;
    getUserAddress(username: string): Promise<string>;
    getProfileAddress(username: string): Promise<string>;
    usernameExists(username: string): Promise<boolean>;
    static load(contractAddress: string, wallet: Wallet): Promise<UsernameRegistry>;
    private static getAbi;
}
