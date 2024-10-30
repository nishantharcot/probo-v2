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
exports.createSymbol = void 0;
const RedisManager_1 = require("../RedisManager");
const createSymbol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockSymbol } = req.params;
    const response = yield RedisManager_1.RedisManager.getInstance().sendAndAwait({
        type: 'CREATE_SYMBOL',
        data: {
            stockSymbol
        }
    });
    res.json(response.payload);
});
exports.createSymbol = createSymbol;
