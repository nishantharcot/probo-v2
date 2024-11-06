"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELL_ORDER_QUEUE = exports.BUY_ORDER_QUEUE = exports.ORDER_QUEUES = exports.STOCK_BALANCES = exports.ORDERBOOK = exports.INR_BALANCES = void 0;
exports.INR_BALANCES = new Map();
exports.ORDERBOOK = new Map();
exports.STOCK_BALANCES = new Map();
exports.ORDER_QUEUES = {
    BUY_ORDER_QUEUE: [],
    SELL_ORDER_QUEUE: []
};
exports.BUY_ORDER_QUEUE = [];
exports.SELL_ORDER_QUEUE = [];
