import { Wallet } from "ethers";
import { UsernameRegistry } from "./username-registry";
import IPFSApi from "ipfs-http-client";
export declare class EthUsername {
    static ROPSTEN_TESTNET: string;
    static LOCAL_TESTNET: string;
    static ipfsApi: IPFSApi;
    private static NETWOR_ADDRESS_MAP;
    private wallet;
    private usernameRegistry;
    constructor(usernameRegistry: UsernameRegistry, wallet: Wallet);
    registerUsername(username: string, profile: object): Promise<object>;
    getProfile(username: string): Promise<object>;
    setUserAddress(username: string, userAddress: string): Promise<object>;
    updateProfile(username: string, profile: object): Promise<object>;
    static load(wallet: Wallet, network: string, options?: object): Promise<EthUsername>;
    static connectToIpfs(apiUrl: string): void;
}
