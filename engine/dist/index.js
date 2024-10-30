"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const data_1 = require("./data");
const RedisManager_1 = require("./RedisManager");
const redisClient = (0, redis_1.createClient)();
function processSubmission(_a) {
    return __awaiter(this, arguments, void 0, function* ({ request, clientID }) {
        console.log("Hi express server, I received your request. I'm processing it currently!");
        console.log("request check:- ", request);
        switch (request.type) {
            case 'CREATE_USER':
                try {
                    const { userId } = request.data;
                    if (!data_1.INR_BALANCES.hasOwnProperty(userId)) {
                        data_1.INR_BALANCES.set(userId, { 'balance': 0, 'locked': 0 });
                        data_1.STOCK_BALANCES.set(userId, new Map());
                    }
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'USER_CREATED',
                        payload: {
                            message: 'User created successfully!'
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'REQUEST_FAILED',
                        payload: {
                            message: 'Could not create user'
                        }
                    });
                }
                break;
            case 'CREATE_SYMBOL':
                try {
                    const { stockSymbol } = request.data;
                    data_1.STOCK_BALANCES.forEach((userMap, userKey) => {
                        userMap.set(stockSymbol, { "yes": { quantity: 0, locked: 0 }, "no": { quantity: 0, locked: 0 } });
                    });
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'SYMBOL_CREATED',
                        payload: {
                            message: 'Symbol created successfully!'
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'REQUEST_FAILED',
                        payload: {
                            message: 'Could not create symbol'
                        }
                    });
                }
                break;
            case 'GET_ORDERBOOK':
                try {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'GET_ORDERBOOK',
                        payload: {
                            message: JSON.stringify(data_1.ORDERBOOK)
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'REQUEST_FAILED',
                        payload: {
                            message: 'Failed to fetch ORDERBOOK'
                        }
                    });
                }
                break;
            case 'GET_STOCK_BALANCES':
                try {
                    const balancesObject = {};
                    data_1.STOCK_BALANCES.forEach((balanceMap, balanceKey) => {
                        const subObject = {};
                        balanceMap.forEach((subMap, subKey) => {
                            subObject[subKey] = subMap;
                        });
                        balancesObject[balanceKey] = subObject;
                    });
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'GET_STOCK_BALANCES',
                        payload: {
                            message: JSON.stringify(balancesObject)
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'REQUEST_FAILED',
                        payload: {
                            message: 'Failed to fetch STOCK_BALANCES'
                        }
                    });
                }
                break;
            case 'GET_INR_BALANCES':
                try {
                    const balancesObject = {};
                    data_1.INR_BALANCES.forEach((balanceMap, balanceKey) => {
                        balancesObject[balanceKey] = balanceMap;
                    });
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'GET_INR_BALANCES',
                        payload: {
                            message: JSON.stringify(balancesObject)
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'REQUEST_FAILED',
                        payload: {
                            message: 'Failed to fetch INR_BALANCES'
                        }
                    });
                }
                break;
            case 'RESET_DATA':
                try {
                    data_1.INR_BALANCES.clear();
                    data_1.ORDERBOOK.clear();
                    data_1.STOCK_BALANCES.clear();
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'RESET_DATA',
                        payload: {
                            message: 'Reset successful'
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'RESET_DATA',
                        payload: {
                            message: 'Reset Failed'
                        }
                    });
                }
                break;
            case 'ONRAMP_INR':
                try {
                    const { userId, amount } = request.data;
                    if (data_1.INR_BALANCES.has(userId)) {
                        const { balance, locked } = data_1.INR_BALANCES.get(userId);
                        data_1.INR_BALANCES.set(userId, { balance: balance + amount, locked: locked });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: 'ONRAMP_INR',
                            payload: {
                                message: 'User doesnt exist'
                            }
                        });
                    }
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'ONRAMP_INR',
                        payload: {
                            message: 'Onramp successful'
                        }
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'ONRAMP_INR',
                        payload: {
                            message: 'Transaction Failed'
                        }
                    });
                }
                break;
            case 'GET_USER_BALANCE':
                try {
                    const { userId } = request.data;
                    if (data_1.INR_BALANCES.has(userId)) {
                        const { balance } = data_1.INR_BALANCES.get(userId);
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: 'GET_USER_BALANCE',
                            payload: {
                                message: JSON.stringify(balance)
                            }
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: 'GET_USER_BALANCE',
                            payload: {
                                message: 'User doesnt exist'
                            }
                        });
                    }
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: 'GET_USER_BALANCE',
                        payload: {
                            message: 'Unable to fetch data'
                        }
                    });
                }
                break;
        }
        console.log('INR_BALANCES:- ', data_1.INR_BALANCES);
        console.log('STOCK_BALANCES:- ', data_1.STOCK_BALANCES);
        // Processing logic 
        // Send to DB to process the request
        // Send it back to queue for websocket server to pick it up
        // redisClient.lPush("processedRequests", "Processing of request is done, here is your result")
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            console.log('Redis connected, listening to requests');
            while (true) {
                const response = yield redisClient.brPop("requests", 0);
                console.log('req check in engine:- ', response);
                yield processSubmission(JSON.parse(response.element));
            }
        }
        catch (_a) {
        }
    });
}
main();
