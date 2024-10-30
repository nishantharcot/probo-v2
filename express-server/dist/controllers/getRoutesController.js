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
exports.getUserBalance = exports.getStockBalances = exports.getInrBalances = exports.getOrderBook = void 0;
const RedisManager_1 = require("../RedisManager");
const getOrderBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield RedisManager_1.RedisManager.getInstance().sendAndAwait({
        type: 'GET_ORDERBOOK'
    });
    console.log('res check:- ', response.payload);
    res.json(JSON.parse(response.payload.message));
});
exports.getOrderBook = getOrderBook;
const getInrBalances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield RedisManager_1.RedisManager.getInstance().sendAndAwait({
        type: 'GET_INR_BALANCES'
    });
    console.log('res check:- ', response.payload);
    res.json(JSON.parse(response.payload.message));
});
exports.getInrBalances = getInrBalances;
const getStockBalances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield RedisManager_1.RedisManager.getInstance().sendAndAwait({
        type: 'GET_STOCK_BALANCES'
    });
    console.log('res check:- ', response.payload);
    res.json(JSON.parse(response.payload.message));
});
exports.getStockBalances = getStockBalances;
const getUserBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const response = yield RedisManager_1.RedisManager.getInstance().sendAndAwait({
        type: 'GET_USER_BALANCE',
        data: {
            userId
        }
    });
    res.json(response.payload);
});
exports.getUserBalance = getUserBalance;
