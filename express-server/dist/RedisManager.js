"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const redis_1 = require("redis");
const uniqid_1 = __importDefault(require("uniqid"));
class RedisManager {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.client.connect();
        this.publisher = (0, redis_1.createClient)();
        this.publisher.connect();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    sendAndAwait(request) {
        console.log('did it come here?');
        return new Promise((resolve) => {
            const id = this.getRandomId();
            this.client.subscribe(id, (message) => {
                console.log('Hey I got back the response from engine');
                console.log('message check:- ', message);
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            });
            this.publisher.lPush("requests", JSON.stringify({ clientID: id, request }));
        });
    }
    getRandomId() {
        return (0, uniqid_1.default)();
    }
}
exports.RedisManager = RedisManager;
