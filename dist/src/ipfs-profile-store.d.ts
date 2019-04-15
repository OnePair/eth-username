export declare class IpfsProfileStore {
    static storeProfile(profile: object): Promise<string>;
    static getProfile(address: string): Promise<object>;
}
