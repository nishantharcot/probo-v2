"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const SubscriptionManager_1 = require("./SubscriptionManager");
class User {
    constructor(id, ws) {
        this.subscriptions = [];
        this.id = id;
        this.ws = ws;
        this.addListeners();
    }
    subscribe(subscription) {
        this.subscriptions.push(subscription);
    }
    unsubscribe(subscription) {
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }
    emit(message) {
        this.ws.send(message);
    }
    addListeners() {
        this.ws.on('message', (message) => {
            console.log('message check:- ', message.toString());
            const parsedMessage = JSON.parse(message.toString());
            console.log('parsedMessage check:- ', parsedMessage);
            if (parsedMessage.method === "SUBSCRIBE") {
                parsedMessage.params.forEach(s => SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(this.id, s));
            }
            // if (parseedMessage.method === "UNSUBSCRIBE") {
            //   parseedMessage.params.forEach(s => SubscriptionManager.getInstance().unsubscribe(this.id, s))
            // }
        });
    }
}
exports.User = User;
