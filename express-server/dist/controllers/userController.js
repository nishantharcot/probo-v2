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
exports.mintTokens = exports.onrampInr = exports.resetData = exports.createUser = void 0;
const RedisManager_js_1 = require("../RedisManager.js");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const response = yield RedisManager_js_1.RedisManager.getInstance().sendAndAwait({
        type: 'CREATE_USER',
        data: {
            userId
        }
    });
    console.log('response check in express server:- ', response);
    res.json(response.payload);
});
exports.createUser = createUser;
const resetData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield RedisManager_js_1.RedisManager.getInstance().sendAndAwait({
        type: 'RESET_DATA',
    });
    res.json(response.payload);
});
exports.resetData = resetData;
const onrampInr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    const response = yield RedisManager_js_1.RedisManager.getInstance().sendAndAwait({
        type: 'ONRAMP_INR',
        data: {
            userId,
            amount
        }
    });
    res.json(response.payload);
});
exports.onrampInr = onrampInr;
const mintTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, stockSymbol, quantity, price } = req.body;
    const response = yield RedisManager_js_1.RedisManager.getInstance().sendAndAwait({
        type: 'MINT',
        data: {
            userId, stockSymbol, quantity, price
        }
    });
    res.json(response.payload);
});
exports.mintTokens = mintTokens;
