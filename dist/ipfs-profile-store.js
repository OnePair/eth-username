"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eth_username_1 = __importDefault(require("./eth-username"));
var IpfsProfileStore = /** @class */ (function () {
    function IpfsProfileStore() {
    }
    /*
    * Store a profile object on ipfs
    */
    IpfsProfileStore.storeProfile = function (profile) {
        return new Promise(function (onSuccess, onError) {
            try {
                var buffer = Buffer.from(JSON.stringify(profile));
                eth_username_1.default.ipfsApi.add(buffer, function (err, fileInfo) {
                    if (err) {
                        onError(err);
                    }
                    else {
                        var address_1 = fileInfo[0]["hash"];
                        // Pin to the node
                        eth_username_1.default.ipfsApi.pin.add(address_1, function () {
                            onSuccess(address_1);
                        });
                    }
                });
            }
            catch (err) {
                onError(err);
            }
        });
    };
    IpfsProfileStore.getProfile = function (address) {
        return new Promise(function (onSuccess, onError) {
            try {
                eth_username_1.default.ipfsApi.cat(address, function (err, file) {
                    if (err) {
                        onError(err);
                    }
                    else {
                        var profileObject = JSON.parse(file.toString());
                        onSuccess(profileObject);
                    }
                });
            }
            catch (err) {
                onError(err);
            }
        });
    };
    return IpfsProfileStore;
}());
exports.default = IpfsProfileStore;
