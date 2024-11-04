import express from "express"
import WebSocket, {WebSocketServer} from "ws"
import { createClient } from "redis";

const app = express();
const redisClient = createClient();


async function startServer () {
    try {
        await redisClient.connect();

        const httpServer = app.listen(8080, () => {
            console.log('WS Server running on port 8080')
        })
        
        const wss = new WebSocketServer({server: httpServer})

        while (true) {
            // Receive data from Engine Server
            const processedRequest = await redisClient.brPop("processedRequests", 0)

            console.log('processed Requests:- ', processedRequest)

            wss.clients.forEach((client) => {
                console.log('good morning!')
                if (client.readyState === WebSocket.OPEN) {
                    // console.log('checking message:- ', processedRequest.toLocaleString())
                    console.log("msg check:- ", processedRequest!.toString())
                    client.send(processedRequest!.element)
                }
            })

            // Send data to frontend
            wss.on('connection', (ws) => {
                // console.log('my clients:- ', wss.clients)

                ws.on('message', (message) => {
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            // console.log('checking message:- ', processedRequest.toLocaleString())
                            console.log("msg check:- ", message.toString())
                            client.send(message.toLocaleString())
                        }
                    })
                })

            
                // ws.send('Hello from ws server')
            })
        }


    } catch {

    }
}

startServer()