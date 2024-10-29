import { createClient, RedisClientType } from "redis";
import { MessageToApi } from "./types/toApi";


export class RedisManager {
    private client: RedisClientType
    private static instance: RedisManager

    private constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance
    }

    public sendToApi( clientID: string, message: MessageToApi ) {
        this.client.publish(clientID, JSON.stringify(message))
    }


}