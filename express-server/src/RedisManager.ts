import { RedisClientType } from "redis";
import { createClient } from "redis";
import {
  API_TO_ENGINE_ORDER_TYPES,
  ENGINE_TO_API_RESPONSE_TYPES,
} from "./types";
import uniqid from "uniqid";

export class RedisManager {
  private client: RedisClientType;
  private publisher: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    this.client = createClient();
    this.client.connect();
    this.publisher = createClient();
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }

    return this.instance;
  }

  public sendAndAwait(request: API_TO_ENGINE_ORDER_TYPES) {
    console.log("did it come here?");
    return new Promise<ENGINE_TO_API_RESPONSE_TYPES>((resolve) => {
      const id = this.getRandomId();

      this.client.subscribe(id, (message) => {
        console.log("Hey I got back the response from engine");
        console.log("message check:- ", message);
        this.client.unsubscribe(id);
        resolve(JSON.parse(message));
      });

      this.publisher.lPush(
        "requests",
        JSON.stringify({ clientID: id, request })
      );
    });
  }

  public getRandomId() {
    return uniqid();
  }
}
