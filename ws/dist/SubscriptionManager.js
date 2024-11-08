"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = void 0;
const redis_1 = require("redis");
const UserManager_1 = require("./UserManager");
class SubscriptionManager {
    constructor() {
        this.subscriptions = new Map();
        this.reverseSubscriptions = new Map();
        this.redisCallbackhandler = (message, channel) => {
            var _a;
            console.log('message check:- ', message);
            // const parsedMessage = JSON.parse(message)
            (_a = this.reverseSubscriptions.get(channel)) === null || _a === void 0 ? void 0 : _a.forEach(s => { var _a; return (_a = UserManager_1.UserManager.getInstance().getUser(s)) === null || _a === void 0 ? void 0 : _a.emit(message); });
        };
        this.redisClient = (0, redis_1.createClient)();
        this.redisClient.connect();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }
    subscribe(userId, subscription) {
        var _a, _b;
        console.log('userId:- ', userId, "subscription:- ", subscription);
        if ((_a = this.subscriptions.get(userId)) === null || _a === void 0 ? void 0 : _a.includes(subscription)) {
            return;
        }
        this.subscriptions.set(userId, (this.subscriptions.get(userId) || []).concat(subscription));
        this.reverseSubscriptions.set(subscription, (this.reverseSubscriptions.get(subscription) || []).concat(userId));
        if (((_b = this.reverseSubscriptions.get(subscription)) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            this.redisClient.subscribe(subscription, this.redisCallbackhandler);
        }
    }
    unsubscribe(userId, subscription) {
        var _a;
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.subscriptions.set(userId, subscriptions.filter(s => s !== subscription));
        }
        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if (reverseSubscriptions) {
            this.reverseSubscriptions.set(userId, reverseSubscriptions.filter(s => s !== userId));
            if (((_a = this.reverseSubscriptions.get(userId)) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }
    userLeft(userId) {
        var _a;
        (_a = this.subscriptions.get(userId)) === null || _a === void 0 ? void 0 : _a.forEach(s => this.unsubscribe(userId, s));
    }
    getSubscriptions(userId) {
        return this.subscriptions.get(userId) || [];
    }
}
exports.SubscriptionManager = SubscriptionManager;
