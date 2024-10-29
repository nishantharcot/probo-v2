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
        console.log('INR_BALANCES:- ', data_1.INR_BALANCES);
        switch (request.type) {
            case 'CREATE_USER':
                const { userId } = request.data;
                if (!data_1.INR_BALANCES.hasOwnProperty(userId)) {
                    data_1.INR_BALANCES.set(userId, { 'balance': 0, 'locked': 0 });
                }
                RedisManager_1.RedisManager.getInstance().sendToApi(clientID, {
                    type: 'USER_CREATED',
                    payload: {
                        message: 'User created successfully!'
                    }
                });
        }
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
