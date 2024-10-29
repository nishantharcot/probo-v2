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

            // Send data to frontend
            wss.on('connection', (ws) => {
                console.log('my clients:- ', wss.clients)
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && processedRequest) {
                        // console.log('checking message:- ', message.toLocaleString())
                        client.send(processedRequest.toLocaleString())
                    }
                })
            
                ws.send('Hello from ws server')
            })
        }


    } catch {

    }
}

startServer()