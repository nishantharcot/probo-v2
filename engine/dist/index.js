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
    return __awaiter(this, arguments, void 0, function* ({ request, clientID, }) {
        console.log("Hi express server, I received your request. I'm processing it currently!");
        console.log("request check:- ", request);
        switch (request.type) {
            case "CREATE_USER":
                try {
                    const { userId } = request.data;
                    if (!data_1.INR_BALANCES.hasOwnProperty(userId)) {
                        data_1.INR_BALANCES.set(userId, { balance: 0, locked: 0 });
                        data_1.STOCK_BALANCES.set(userId, new Map());
                    }
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "USER_CREATED",
                        payload: {
                            message: "User created successfully!",
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Could not create user",
                        },
                    });
                }
                break;
            case "CREATE_SYMBOL":
                try {
                    const { stockSymbol } = request.data;
                    data_1.STOCK_BALANCES.forEach((userMap, userKey) => {
                        userMap.set(stockSymbol, {
                            yes: { quantity: 0, locked: 0 },
                            no: { quantity: 0, locked: 0 },
                        });
                    });
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "SYMBOL_CREATED",
                        payload: {
                            message: "Symbol created successfully!",
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Could not create symbol",
                        },
                    });
                }
                break;
            case "GET_ORDERBOOK":
                try {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_ORDERBOOK",
                        payload: {
                            message: JSON.stringify(data_1.ORDERBOOK),
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Failed to fetch ORDERBOOK",
                        },
                    });
                }
                break;
            case "GET_STOCK_BALANCES":
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
                        type: "GET_STOCK_BALANCES",
                        payload: {
                            message: JSON.stringify(balancesObject),
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Failed to fetch STOCK_BALANCES",
                        },
                    });
                }
                break;
            case "GET_INR_BALANCES":
                try {
                    const balancesObject = {};
                    data_1.INR_BALANCES.forEach((balanceMap, balanceKey) => {
                        balancesObject[balanceKey] = balanceMap;
                    });
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_INR_BALANCES",
                        payload: {
                            message: JSON.stringify(balancesObject),
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Failed to fetch INR_BALANCES",
                        },
                    });
                }
                break;
            case "RESET_DATA":
                try {
                    data_1.INR_BALANCES.clear();
                    data_1.ORDERBOOK.clear();
                    data_1.STOCK_BALANCES.clear();
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "RESET_DATA",
                        payload: {
                            message: "Reset successful",
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "RESET_DATA",
                        payload: {
                            message: "Reset Failed",
                        },
                    });
                }
                break;
            case "ONRAMP_INR":
                try {
                    const { userId, amount } = request.data;
                    if (data_1.INR_BALANCES.has(userId)) {
                        const { balance, locked } = data_1.INR_BALANCES.get(userId);
                        data_1.INR_BALANCES.set(userId, {
                            balance: balance + amount,
                            locked: locked,
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "ONRAMP_INR",
                            payload: {
                                message: "User doesnt exist",
                            },
                        });
                    }
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "ONRAMP_INR",
                        payload: {
                            message: "Onramp successful",
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "ONRAMP_INR",
                        payload: {
                            message: "Transaction Failed",
                        },
                    });
                }
                break;
            case "GET_USER_BALANCE":
                try {
                    const { userId } = request.data;
                    if (data_1.INR_BALANCES.has(userId)) {
                        const { balance } = data_1.INR_BALANCES.get(userId);
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "GET_USER_BALANCE",
                            payload: {
                                message: JSON.stringify(balance),
                            },
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "GET_USER_BALANCE",
                            payload: {
                                message: "User doesnt exist",
                            },
                        });
                    }
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_USER_BALANCE",
                        payload: {
                            message: "Unable to fetch data",
                        },
                    });
                }
                break;
            case "BUY":
                try {
                    let { userId, stockSymbol, quantity, price, stockType } = request.data;
                    // STEP 1:- CHECK FOR SUFFICIENT BALANCE
                    const stockCost = quantity * price;
                    const userBalance = data_1.INR_BALANCES.get(userId);
                    if (userBalance.balance < stockCost) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "BUY",
                            payload: {
                                message: "Insufficient INR balance",
                            },
                        });
                        break;
                    }
                    // STEP 2:- CHECK FOR STOCK IN ORDERBOOK
                    const exists = data_1.ORDERBOOK.get(stockSymbol)[stockType];
                    if (!exists) {
                        // UPDATE ORDERBOOK AND INR_BALANCES
                        data_1.BUY_ORDER_QUEUE.push({
                            userId: userId,
                            stockSymbol: stockSymbol,
                            quantity: quantity,
                            price: price,
                            stockType: stockType,
                        });
                        data_1.INR_BALANCES.get(userId).balance -= stockCost;
                        data_1.INR_BALANCES.get(userId).locked += stockCost;
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "BUY",
                            payload: {
                                message: "Buy order placed and pending",
                            },
                        });
                        break;
                    }
                    // STEP 3:- ITERATE SELL_ORDER_QUEUE AND FULFILL THE ORDERS
                    const indexesToBeDeleted = [];
                    const origQuantity = quantity;
                    for (let i = 0; i < data_1.SELL_ORDER_QUEUE.length; i++) {
                        let { userId: sellerUserId, stockSymbol: sellerstockSymbol, quantity: sellerQuantity, price: sellerPrice, stockType: sellerStockType, } = data_1.SELL_ORDER_QUEUE[i];
                        if (sellerstockSymbol != stockSymbol || sellerStockType != stockType || sellerPrice > price) {
                            continue;
                        }
                        let toBeExecuted = 0;
                        if (sellerQuantity <= quantity) {
                            indexesToBeDeleted.push(i);
                            toBeExecuted = sellerQuantity;
                        }
                        else {
                            toBeExecuted = quantity;
                        }
                        // SELLER details update
                        data_1.INR_BALANCES.get(sellerUserId).locked -= toBeExecuted * sellerPrice;
                        data_1.STOCK_BALANCES.get(sellerUserId).get(stockSymbol)[stockType].locked -= toBeExecuted;
                        const priceKey = (sellerPrice / 100).toString();
                        data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].total -= toBeExecuted;
                        const prevQuantity = data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.get(sellerUserId);
                        data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.set(sellerUserId, prevQuantity - toBeExecuted);
                        // BUYER details update
                        data_1.INR_BALANCES.get(userId).balance -= toBeExecuted * sellerPrice;
                        if (data_1.STOCK_BALANCES.has(userId)) {
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            if (userData.has(stockSymbol)) {
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            else {
                                userData.set(stockSymbol, { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } });
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            data_1.STOCK_BALANCES.get(userId).get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        else {
                            data_1.STOCK_BALANCES.set(userId, new Map());
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            userData.set(stockSymbol, { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } });
                            userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        quantity -= toBeExecuted;
                        sellerQuantity -= toBeExecuted;
                        if (sellerQuantity == 0) {
                            indexesToBeDeleted.push(i);
                        }
                        if (quantity == 0) {
                            break;
                        }
                    }
                    // Delete elements in queue
                    let j = 0;
                    data_1.SELL_ORDER_QUEUE.filter((item, index) => {
                        if (index != indexesToBeDeleted[j]) {
                            return true;
                        }
                        else {
                            j += 1;
                            return false;
                        }
                    });
                    if (quantity == 0) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "BUY",
                            payload: {
                                message: "Buy order placed and trade executed",
                            },
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "BUY",
                            payload: {
                                message: `Buy order matched partially, ${quantity} remaining`,
                            },
                        });
                    }
                    redisClient.lPush("processedRequests", data_1.ORDERBOOK);
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_USER_BALANCE",
                        payload: {
                            message: "Unable to fetch data",
                        },
                    });
                }
                break;
            case "SELL":
                try {
                    let { userId, stockSymbol, quantity, price, stockType } = request.data;
                    // STEP 1:- CHECK IF USER HAS SUFFICIENT STOCK BALANCE
                    const stockExists = data_1.STOCK_BALANCES.get(userId).get(stockSymbol);
                    if (!stockExists) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Stock doesn't exist in your account",
                            },
                        });
                        break;
                    }
                    const stockTypeExists = stockExists[stockType];
                    if (!stockTypeExists) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: `${stockType} Stock for ${stockSymbol} doesn't exist in your account`,
                            },
                        });
                        break;
                    }
                    const stockQuantity = stockTypeExists.quantity;
                    if (stockQuantity < quantity) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Stock balance insufficient",
                            },
                        });
                        break;
                    }
                    // STEP 2:- Iterate Buy Order Queue
                    const indexesToBeDeleted = [];
                    const origQuantity = quantity;
                    for (let i = 0; i < data_1.BUY_ORDER_QUEUE.length; i++) {
                        let { userId: buyerUserId, stockSymbol: buyerstockSymbol, quantity: buyerQuantity, price: buyerPrice, stockType: buyerStockType, } = data_1.BUY_ORDER_QUEUE[i];
                        if (buyerstockSymbol != stockSymbol || buyerStockType != stockType || buyerPrice < price) {
                            continue;
                        }
                        let toBeExecuted = 0;
                        if (buyerQuantity <= quantity) {
                            indexesToBeDeleted.push(i);
                            toBeExecuted = buyerQuantity;
                        }
                        else {
                            toBeExecuted = quantity;
                        }
                        // buyer details update
                        data_1.INR_BALANCES.get(buyerUserId).locked -= toBeExecuted * buyerPrice;
                        data_1.STOCK_BALANCES.get(buyerUserId).get(stockSymbol)[stockType].locked -= toBeExecuted;
                        const priceKey = (buyerPrice / 100).toString();
                        data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].total -= toBeExecuted;
                        const prevQuantity = data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.get(buyerUserId);
                        data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.set(buyerUserId, prevQuantity - toBeExecuted);
                        // BUYER details update
                        data_1.INR_BALANCES.get(userId).balance -= toBeExecuted * buyerPrice;
                        if (data_1.STOCK_BALANCES.has(userId)) {
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            if (userData.has(stockSymbol)) {
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            else {
                                userData.set(stockSymbol, { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } });
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            data_1.STOCK_BALANCES.get(userId).get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        else {
                            data_1.STOCK_BALANCES.set(userId, new Map());
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            userData.set(stockSymbol, { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } });
                            userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        quantity -= toBeExecuted;
                        buyerQuantity -= toBeExecuted;
                        if (buyerQuantity == 0) {
                            indexesToBeDeleted.push(i);
                        }
                        if (quantity == 0) {
                            break;
                        }
                    }
                    // Delete items
                    let j = 0;
                    data_1.BUY_ORDER_QUEUE.filter((item, index) => {
                        if (index != indexesToBeDeleted[j]) {
                            return true;
                        }
                        else {
                            j += 1;
                            return false;
                        }
                    });
                    if (quantity == 0) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Sell order placed and trade executed",
                            },
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: `Buy order matched partially, ${quantity} remaining`,
                            },
                        });
                    }
                    redisClient.lPush("processedRequests", data_1.ORDERBOOK);
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_USER_BALANCE",
                        payload: {
                            message: "Unable to fetch data",
                        },
                    });
                }
        }
        console.log("INR_BALANCES:- ", data_1.INR_BALANCES);
        console.log("STOCK_BALANCES:- ", data_1.STOCK_BALANCES);
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
            console.log("Redis connected, listening to requests");
            while (true) {
                const response = yield redisClient.brPop("requests", 0);
                console.log("req check in engine:- ", response);
                yield processSubmission(JSON.parse(response.element));
            }
        }
        catch (_a) { }
    });
}
main();
