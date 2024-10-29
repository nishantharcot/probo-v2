import { createClient } from "redis";
import { REQUEST_TYPES } from "./types";
import { ORDERBOOK, INR_BALANCES } from "./data";
import { MessageFromApi } from "./types/fromAPI";
import { RedisManager } from "./RedisManager";


const redisClient = createClient();

async function processSubmission({request, clientID} : {request: MessageFromApi, clientID: string}) {
    console.log("Hi express server, I received your request. I'm processing it currently!")

    console.log("request check:- ", request)

    console.log('INR_BALANCES:- ', INR_BALANCES)

    switch(request.type) {
        case 'CREATE_USER':
            const {userId} = request.data
            if (!INR_BALANCES.hasOwnProperty(userId)) {
                INR_BALANCES.set(userId, {'balance': 0, 'locked': 0})
            }
            RedisManager.getInstance().sendToApi(clientID, {
                type: 'USER_CREATED',
                payload: {
                    message: 'User created successfully!'
                }
            })
    }

    // Processing logic 

    // Send to DB to process the request

    // Send it back to queue for websocket server to pick it up
    // redisClient.lPush("processedRequests", "Processing of request is done, here is your result")


}


async function main() {
    try {
        await redisClient.connect();

        console.log('Redis connected, listening to requests')

        while (true) {
            const response = await redisClient.brPop("requests", 0)

            console.log('req check in engine:- ', response)

            await processSubmission(JSON.parse(response.element))
        }

    } catch {

    }
}


main()