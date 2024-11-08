"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const User_1 = require("./User");
const SubscriptionManager_1 = require("./SubscriptionManager");
class UserManager {
    constructor() {
        this.users = new Map();
    }
    static getInstance() {
        if (!this.instace) {
            this.instace = new UserManager();
        }
        return this.instace;
    }
    addUser(ws) {
        // console.log("yo mann!")
        const id = this.getRandomId();
        const user = new User_1.User(id, ws);
        // console.log('user check:-', user)
        // console.log('yo nigga all cool')
        this.users.set(id, user);
        this.registerOnClose(ws, id);
        return user;
    }
    registerOnClose(ws, id) {
        console.log('register on close yo!!');
        ws.on('close', () => {
            this.users.delete(id);
            console.log('did it reach here???');
            SubscriptionManager_1.SubscriptionManager.getInstance().userLeft(id);
        });
    }
    getUser(id) {
        return this.users.get(id);
    }
    getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
exports.UserManager = UserManager;
