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
const utils_1 = require("./utils");
const data_2 = require("./data");
const redisClient = (0, redis_1.createClient)();
function processSubmission(_a) {
    return __awaiter(this, arguments, void 0, function* ({ request, clientID, }) {
        var _b, _c;
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
                            message: (0, utils_1.serializeOrderBook)(data_1.ORDERBOOK),
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
                    console.log("step 1 success!!");
                    // STEP 2:- CHECK FOR STOCK IN ORDERBOOK
                    const exists = data_1.ORDERBOOK.get(stockSymbol)[stockType];
                    if (!exists) {
                        // UPDATE ORDERBOOK AND INR_BALANCES
                        data_2.ORDER_QUEUES.BUY_ORDER_QUEUE.push({
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
                    console.log("step 2 success!!");
                    // STEP 3:- ITERATE ORDER_QUEUES.SELL_ORDER_QUEUE AND FULFILL THE ORDERS
                    const indexesToBeDeleted = new Map();
                    const origQuantity = quantity;
                    for (let i = 0; i < data_2.ORDER_QUEUES.SELL_ORDER_QUEUE.length; i++) {
                        let { userId: sellerUserId, stockSymbol: sellerstockSymbol, quantity: sellerQuantity, price: sellerPrice, stockType: sellerStockType, } = data_2.ORDER_QUEUES.SELL_ORDER_QUEUE[i];
                        if (sellerstockSymbol != stockSymbol ||
                            sellerStockType != stockType ||
                            sellerPrice > price) {
                            continue;
                        }
                        let toBeExecuted = 0;
                        if (sellerQuantity <= quantity) {
                            indexesToBeDeleted.set(i, 1);
                            toBeExecuted = sellerQuantity;
                        }
                        else {
                            toBeExecuted = quantity;
                        }
                        // SELLER details update
                        data_1.INR_BALANCES.get(sellerUserId).locked -= toBeExecuted * sellerPrice;
                        data_1.INR_BALANCES.get(sellerUserId).balance += toBeExecuted * sellerPrice;
                        data_1.STOCK_BALANCES.get(sellerUserId).get(stockSymbol)[stockType].locked -= toBeExecuted;
                        const priceKey = (sellerPrice / 100).toString();
                        data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].total -=
                            toBeExecuted;
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
                                userData.set(stockSymbol, {
                                    yes: { quantity: 0, locked: 0 },
                                    no: { quantity: 0, locked: 0 },
                                });
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            data_1.STOCK_BALANCES.get(userId).get(stockSymbol)[stockType].quantity +=
                                toBeExecuted;
                        }
                        else {
                            data_1.STOCK_BALANCES.set(userId, new Map());
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            userData.set(stockSymbol, {
                                yes: { quantity: 0, locked: 0 },
                                no: { quantity: 0, locked: 0 },
                            });
                            userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        quantity -= toBeExecuted;
                        sellerQuantity -= toBeExecuted;
                        if (sellerQuantity == 0) {
                            indexesToBeDeleted.set(i, 1);
                        }
                        else {
                            data_2.ORDER_QUEUES.SELL_ORDER_QUEUE[i] = {
                                userId: sellerUserId,
                                stockSymbol: sellerstockSymbol,
                                quantity: sellerQuantity,
                                price: sellerPrice,
                                stockType: sellerStockType,
                            };
                        }
                        if (quantity == 0) {
                            break;
                        }
                    }
                    console.log("step 3 success!!");
                    // Delete elements in queue
                    data_2.ORDER_QUEUES.SELL_ORDER_QUEUE = data_2.ORDER_QUEUES.SELL_ORDER_QUEUE.filter((item, index) => {
                        if (indexesToBeDeleted.has(index)) {
                            return false;
                        }
                        else {
                            return true;
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
                    const origQuantity = quantity;
                    console.log("started step 1");
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
                    console.log("finished step 1");
                    console.log("passed step 1");
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
                    console.log("stockTypeExists passed");
                    const stockQuantity = stockTypeExists.quantity;
                    console.log("stockQuantity passed:- ", stockQuantity);
                    if (stockQuantity < quantity) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Stock balance insufficient",
                            },
                        });
                        break;
                    }
                    console.log("Started step 2");
                    // STEP 2:- Iterate Buy Order Queue
                    const indexesToBeDeleted = new Map();
                    for (let i = 0; i < data_2.ORDER_QUEUES.BUY_ORDER_QUEUE.length; i++) {
                        let { userId: buyerUserId, stockSymbol: buyerstockSymbol, quantity: buyerQuantity, price: buyerPrice, stockType: buyerStockType, } = data_2.ORDER_QUEUES.BUY_ORDER_QUEUE[i];
                        if (buyerstockSymbol != stockSymbol ||
                            buyerStockType != stockType ||
                            buyerPrice < price) {
                            continue;
                        }
                        let toBeExecuted = 0;
                        if (buyerQuantity <= quantity) {
                            indexesToBeDeleted.set(i, 1);
                            toBeExecuted = buyerQuantity;
                        }
                        else {
                            toBeExecuted = quantity;
                        }
                        // buyer details update
                        data_1.INR_BALANCES.get(buyerUserId).locked -= toBeExecuted * buyerPrice;
                        data_1.STOCK_BALANCES.get(buyerUserId).get(stockSymbol)[stockType].locked -= toBeExecuted;
                        // BUYER details update
                        data_1.INR_BALANCES.get(userId).balance -= toBeExecuted * buyerPrice;
                        if (data_1.STOCK_BALANCES.has(userId)) {
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            if (userData.has(stockSymbol)) {
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            else {
                                userData.set(stockSymbol, {
                                    yes: { quantity: 0, locked: 0 },
                                    no: { quantity: 0, locked: 0 },
                                });
                                userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                            }
                            data_1.STOCK_BALANCES.get(userId).get(stockSymbol)[stockType].quantity +=
                                toBeExecuted;
                        }
                        else {
                            data_1.STOCK_BALANCES.set(userId, new Map());
                            const userData = data_1.STOCK_BALANCES.get(userId);
                            userData.set(stockSymbol, {
                                yes: { quantity: 0, locked: 0 },
                                no: { quantity: 0, locked: 0 },
                            });
                            userData.get(stockSymbol)[stockType].quantity += toBeExecuted;
                        }
                        quantity -= toBeExecuted;
                        buyerQuantity -= toBeExecuted;
                        if (buyerQuantity == 0) {
                            indexesToBeDeleted.set(i, 1);
                        }
                        if (quantity == 0) {
                            break;
                        }
                    }
                    console.log("Passed step 2");
                    // Delete items
                    data_2.ORDER_QUEUES.BUY_ORDER_QUEUE = data_2.ORDER_QUEUES.BUY_ORDER_QUEUE.filter((item, index) => {
                        if (indexesToBeDeleted.has(index)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                    console.log("Passed step 2");
                    if (quantity > 0) {
                        const priceKey = (price / 100).toString();
                        if (data_1.ORDERBOOK.has(stockSymbol) &&
                            data_1.ORDERBOOK.get(stockSymbol)[stockType]) {
                            if (data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey]) {
                                data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].total +=
                                    quantity;
                                if (data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.has(userId)) {
                                    const current = data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.get(userId);
                                    data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.set(userId, quantity + current);
                                }
                                else {
                                    data_1.ORDERBOOK.get(stockSymbol)[stockType][priceKey].orders.set(userId, quantity);
                                }
                            }
                            else {
                                data_1.ORDERBOOK.get(stockSymbol)[stockType] = {
                                    priceKey: {
                                        total: quantity,
                                        orders: new Map([[userId, quantity]]),
                                    },
                                };
                            }
                        }
                        else {
                            data_1.ORDERBOOK.set(stockSymbol, {
                                [stockType]: {
                                    [priceKey]: {
                                        total: quantity,
                                        orders: new Map([[userId, quantity]]),
                                    },
                                },
                            });
                        }
                        data_2.ORDER_QUEUES.SELL_ORDER_QUEUE.push({
                            userId,
                            stockSymbol,
                            quantity,
                            price,
                            stockType,
                        });
                        const userBalanceDetails = data_1.INR_BALANCES.get(userId);
                        data_1.INR_BALANCES.set(userId, {
                            balance: userBalanceDetails.balance - (quantity * price),
                            locked: userBalanceDetails.locked + (quantity * price)
                        });
                    }
                    if (quantity == 0) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Sell order placed and trade executed",
                            },
                        });
                    }
                    else if (quantity == origQuantity) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: "Sell order placed and pending",
                            },
                        });
                    }
                    else {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "SELL",
                            payload: {
                                message: `Sell order matched partially, ${quantity} remaining`,
                            },
                        });
                    }
                    // redisClient.lPush("ws_server", ORDERBOOK)
                }
                catch (e) {
                    console.log("error check:- ", e);
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "GET_USER_BALANCE",
                        payload: {
                            message: "Unable to fetch data",
                        },
                    });
                }
                break;
            case "MINT":
                try {
                    const { userId, stockSymbol, quantity, price } = request.data;
                    const reqdBalance = 2 * quantity * price;
                    const userBalance = data_1.INR_BALANCES.get(userId).balance;
                    if (userBalance < reqdBalance) {
                        RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                            type: "MINT",
                            payload: {
                                message: "Insufficient User Balance",
                            },
                        });
                    }
                    // STEP 1:- UPDATE USER BALANCE
                    const userBalanceData = data_1.INR_BALANCES.get(userId);
                    data_1.INR_BALANCES.set(userId, {
                        balance: userBalance - reqdBalance,
                        locked: userBalanceData.locked,
                    });
                    // STEP 2:- UPDATE STOCK BALANCES
                    const stockBalanceData = data_1.STOCK_BALANCES.get(userId);
                    const stockAlreadyExists = stockBalanceData.get(stockSymbol);
                    if (stockAlreadyExists) {
                        const yesExists = (_b = stockBalanceData.get(stockSymbol)) === null || _b === void 0 ? void 0 : _b.yes;
                        const noExists = (_c = stockBalanceData === null || stockBalanceData === void 0 ? void 0 : stockBalanceData.get(stockSymbol)) === null || _c === void 0 ? void 0 : _c.no;
                        if (yesExists) {
                            stockBalanceData.get(stockSymbol).yes.quantity += quantity;
                        }
                        else {
                            stockBalanceData.get(stockSymbol)["yes"] = {
                                locked: 0,
                                quantity: quantity,
                            };
                        }
                        if (noExists) {
                            stockBalanceData.get(stockSymbol).no.quantity += quantity;
                        }
                        else {
                            stockBalanceData.get(stockSymbol)["no"] = {
                                locked: 0,
                                quantity: quantity,
                            };
                        }
                    }
                    const remainingBalacnce = data_1.INR_BALANCES.get(userId).balance;
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "MINT",
                        payload: {
                            message: `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is ${remainingBalacnce}`,
                        },
                    });
                }
                catch (e) {
                    RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                        type: "REQUEST_FAILED",
                        payload: {
                            message: "Could not mint tokens",
                        },
                    });
                }
                break;
        }
        console.log("ORDER_QUEUES.SELL_ORDER_QUEUE:- ", data_2.ORDER_QUEUES.SELL_ORDER_QUEUE);
        console.log("ORDER_QUEUES.BUY_ORDER_QUEUE:- ", data_2.ORDER_QUEUES.BUY_ORDER_QUEUE);
        console.log("INR_BALANCES:- ", data_1.INR_BALANCES);
        console.log("STOCK_BALANCES:- ", data_1.STOCK_BALANCES);
        console.log("ORDERBOOK:- ", data_1.ORDERBOOK);
        // Processing logic
        // Send to DB to process the request
        // Send it back to queue for websocket server to pick it up
        redisClient.lPush("ws_server", (0, utils_1.serializeOrderBook)(data_1.ORDERBOOK));
        redisClient.lPush("db_server", (0, utils_1.serializeOrderBook)(data_1.ORDERBOOK));
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
        catch (e) {
            console.log("Engine server failed to start:- ", e);
        }
    });
}
main();
