import { EthUsername } from "./eth-username";

export class IpfsProfileStore {

  /*
  * Store a profile object on ipfs
  */
  public static storeProfile(profile: object): Promise<string> {
    return new Promise((onSuccess: Function, onError: Function) => {
      try {
        let buffer = Buffer.from(JSON.stringify(profile));

        EthUsername.ipfsApi.add(buffer, (err, fileInfo: object) => {
          if (err) {
            onError(err)
          } else {
            let address = fileInfo[0]["hash"];

            // Pin to the node
            EthUsername.ipfsApi.pin.add(address, () => {
              onSuccess(address);
            });
          }
        });
      } catch (err) {
        onError(err);
      }
    });
  }

  public static getProfile(address: string): Promise<object> {
    return new Promise<object>((onSuccess: Function, onError: Function) => {
      try {
        EthUsername.ipfsApi.cat(address, (err, file) => {
          if (err) {
            onError(err);
          } else {
            let profileObject = JSON.parse(file.toString());
            onSuccess(profileObject);
          }
        });
      } catch (err) {
        onError(err);
      }
    });
  }
}
