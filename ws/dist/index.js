"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const UserManager_1 = require("./UserManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("connection opened");
    UserManager_1.UserManager.getInstance().addUser(ws);
});
