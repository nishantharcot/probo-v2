import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({port: 8080})

wss.on("connection", (ws) => {
    console.log("connection opened")
    UserManager.getInstance().addUser(ws)
})