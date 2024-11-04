"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeOrderBook = serializeOrderBook;
function entriesToObject(entries) {
    const obj = {};
    entries.forEach(([key, value]) => {
        obj[key] = value;
    });
    return obj;
}
function getEntries(obj) {
    const entries = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            entries.push([key, obj[key]]);
        }
    }
    return entries;
}
function serializeOrderBook(orderBook) {
    return JSON.stringify(Array.from(orderBook, ([key, orderType]) => [
        key,
        {
            yes: orderType.yes
                ? entriesToObject(getEntries(orderType.yes).map(([price, orderDetails]) => [
                    price,
                    {
                        total: orderDetails.total,
                        orders: Array.from(orderDetails.orders),
                    },
                ]))
                : undefined,
            no: orderType.no
                ? entriesToObject(getEntries(orderType.no).map(([price, orderDetails]) => [
                    price,
                    {
                        total: orderDetails.total,
                        orders: Array.from(orderDetails.orders),
                    },
                ]))
                : undefined,
        },
    ]));
}
