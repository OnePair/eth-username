"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var providers_1 = require("ethers/providers");
var ethers_1 = require("ethers");
var ganache_cli_1 = __importDefault(require("ganache-cli"));
var eth_username_1 = __importDefault(require("../eth-username"));
var username_registry_contract_1 = __importDefault(require("../contract/username-registry-contract"));
var web3_1 = __importDefault(require("web3"));
describe("Testing eth-username", function () { return __awaiter(_this, void 0, void 0, function () {
    var IPFS_HOST, RPC_HOST, USER1, USER2, USER1_PROFILE, USER1_PROFILE2, USER2_PROFILE, ethServer, rpcProvider, web3, user1Wallet, user2Wallet, usernameRegistryAddress, ethUsername1, ethUsername2;
    var _this = this;
    return __generator(this, function (_a) {
        IPFS_HOST = "/ip4/127.0.0.1/tcp/5001";
        RPC_HOST = "http://127.0.0.1:9545";
        USER1 = "user1";
        USER2 = "user2";
        USER1_PROFILE = { name: "user1" };
        USER1_PROFILE2 = { name: "user1", lastName: "last name" };
        USER2_PROFILE = { name: "user2" };
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Connecting to ipfs...");
                        eth_username_1.default.connectToIpfs(IPFS_HOST);
                        console.log("Creating test chain...");
                        // Create the test ethereum network
                        ethServer = ganache_cli_1.default.server();
                        ethServer.listen(9545);
                        rpcProvider = new providers_1.JsonRpcProvider(RPC_HOST);
                        // Initialize the web3 provider
                        web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(RPC_HOST));
                        return [4 /*yield*/, web3.eth.getAccounts()];
                    case 1:
                        accounts = _a.sent();
                        // Create the user wallets
                        user1Wallet = ethers_1.Wallet.createRandom().connect(rpcProvider);
                        user2Wallet = ethers_1.Wallet.createRandom().connect(rpcProvider);
                        console.log("Funding user wallets...");
                        // Fund the user accounts
                        return [4 /*yield*/, web3.eth.sendTransaction({
                                from: accounts[1],
                                to: user1Wallet.address,
                                value: '5002465260000000000'
                            })];
                    case 2:
                        // Fund the user accounts
                        _a.sent();
                        return [4 /*yield*/, web3.eth.sendTransaction({
                                from: accounts[1],
                                to: user2Wallet.address,
                                value: '5002465260000000000'
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe("Deployment", function () {
            it("Should successfully deploy the username-registry contract", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    username_registry_contract_1.default.deploy(user1Wallet).then(function (address) {
                        usernameRegistryAddress = address;
                        console.log("Contract address:", usernameRegistryAddress);
                        done();
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
        });
        describe("Username registration", function () {
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, eth_username_1.default.load(user1Wallet, eth_username_1.default.LOCAL_TESTNET, { contractAddress: usernameRegistryAddress })];
                        case 1:
                            ethUsername1 = _a.sent();
                            return [4 /*yield*/, eth_username_1.default.load(user2Wallet, eth_username_1.default.LOCAL_TESTNET, { contractAddress: usernameRegistryAddress })];
                        case 2:
                            ethUsername2 = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should register a new username", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.registerUsername(USER1, USER1_PROFILE)
                        .then(function (transaction) {
                        done();
                        console.log("Transaction address:", transaction["hash"]);
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
            it("Should be denied from registering the same username", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername2.registerUsername(USER1, USER2_PROFILE)
                        .then(function () {
                        done(new Error("Should of been denied!"));
                    }).catch(function () {
                        done();
                    });
                });
            });
        });
        describe("Username profile", function () {
            it("Should get the right profle", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.getProfile(USER1).then(function (profile) {
                        chai_1.expect(profile).to.deep.equal(USER1_PROFILE);
                        done();
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
            it("Should update the profile", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.updateProfile(USER1, USER1_PROFILE2).then(function (transaction) {
                        done();
                        console.log("Transaction address:", transaction["hash"]);
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
            it("Should be denied from updating the profile", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername2.updateProfile(USER1, USER1_PROFILE2).then(function () {
                        done(new Error("Should of been denied!"));
                    }).catch(function () {
                        done();
                    });
                });
            });
        });
        describe("Username address", function () {
            it("Should transfer ownership to a new address", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.setUserAddress(USER1, user2Wallet.address).then(function (transaction) {
                        done();
                        console.log("Transaction address:", transaction["hash"]);
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
            it("New owner should be able to update the profile", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername2.updateProfile(USER1, USER2_PROFILE).then(function (transaction) {
                        done();
                        console.log("Transaction address:", transaction["hash"]);
                    }).catch(function (err) {
                        done(new Error(err));
                    });
                });
            });
            it("Old owner should be denied from updating the profile", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.updateProfile(USER1, USER1_PROFILE2).then(function () {
                        done(new Error("Should of been denied!"));
                    }).catch(function () {
                        done();
                    });
                });
            });
            it("Old owner should be denied from setting the user address", function (done) {
                chai_1.assert.doesNotThrow(function () {
                    ethUsername1.setUserAddress(USER1, user1Wallet.address).then(function () {
                        done(new Error("Should of been denied!"));
                    }).catch(function () {
                        done();
                    });
                });
            });
        });
        after(function () {
            ethServer.close();
        });
        return [2 /*return*/];
    });
}); });
