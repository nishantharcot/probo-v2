import { createClient } from "redis";
import { REQUEST_TYPES } from "./types";
import {
  ORDERBOOK,
  INR_BALANCES,
  STOCK_BALANCES,
  BUY_ORDER_QUEUE,
  SELL_ORDER_QUEUE,
} from "./data";
import { MessageFromApi } from "./types/fromAPI";
import { RedisManager } from "./RedisManager";

const redisClient = createClient();

async function processSubmission({
  request,
  clientID,
}: {
  request: MessageFromApi;
  clientID: string;
}) {
  console.log(
    "Hi express server, I received your request. I'm processing it currently!"
  );

  console.log("request check:- ", request);

  switch (request.type) {
    case "CREATE_USER":
      try {
        const { userId } = request.data;
        if (!INR_BALANCES.hasOwnProperty(userId)) {
          INR_BALANCES.set(userId, { balance: 0, locked: 0 });
          STOCK_BALANCES.set(userId, new Map());
        }
        RedisManager.getInstance().sendToApi(clientID, {
          type: "USER_CREATED",
          payload: {
            message: "User created successfully!",
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "REQUEST_FAILED",
          payload: {
            message: "Could not create user",
          },
        });
      }
      break;
    case "CREATE_SYMBOL":
      try {
        const { stockSymbol } = request.data;
        STOCK_BALANCES.forEach((userMap, userKey) => {
          userMap.set(stockSymbol, {
            yes: { quantity: 0, locked: 0 },
            no: { quantity: 0, locked: 0 },
          });
        });
        RedisManager.getInstance().sendToApi(clientID, {
          type: "SYMBOL_CREATED",
          payload: {
            message: "Symbol created successfully!",
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "REQUEST_FAILED",
          payload: {
            message: "Could not create symbol",
          },
        });
      }
      break;
    case "GET_ORDERBOOK":
      try {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "GET_ORDERBOOK",
          payload: {
            message: JSON.stringify(ORDERBOOK),
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "REQUEST_FAILED",
          payload: {
            message: "Failed to fetch ORDERBOOK",
          },
        });
      }
      break;
    case "GET_STOCK_BALANCES":
      try {
        const balancesObject: any = {};

        STOCK_BALANCES.forEach((balanceMap, balanceKey) => {
          const subObject: any = {};
          balanceMap.forEach((subMap, subKey) => {
            subObject[subKey] = subMap;
          });
          balancesObject[balanceKey] = subObject;
        });

        RedisManager.getInstance().sendToApi(clientID, {
          type: "GET_STOCK_BALANCES",
          payload: {
            message: JSON.stringify(balancesObject),
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "REQUEST_FAILED",
          payload: {
            message: "Failed to fetch STOCK_BALANCES",
          },
        });
      }
      break;
    case "GET_INR_BALANCES":
      try {
        const balancesObject: any = {};

        INR_BALANCES.forEach((balanceMap, balanceKey) => {
          balancesObject[balanceKey] = balanceMap;
        });

        RedisManager.getInstance().sendToApi(clientID, {
          type: "GET_INR_BALANCES",
          payload: {
            message: JSON.stringify(balancesObject),
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "REQUEST_FAILED",
          payload: {
            message: "Failed to fetch INR_BALANCES",
          },
        });
      }
      break;
    case "RESET_DATA":
      try {
        INR_BALANCES.clear();
        ORDERBOOK.clear();
        STOCK_BALANCES.clear();

        RedisManager.getInstance().sendToApi(clientID, {
          type: "RESET_DATA",
          payload: {
            message: "Reset successful",
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "RESET_DATA",
          payload: {
            message: "Reset Failed",
          },
        });
      }
      break;
    case "ONRAMP_INR":
      try {
        const { userId, amount } = request.data;

        if (INR_BALANCES.has(userId)) {
          const { balance, locked } = INR_BALANCES.get(userId)!;
          INR_BALANCES.set(userId, {
            balance: balance + amount,
            locked: locked,
          });
        } else {
          RedisManager.getInstance().sendToApi(clientID, {
            type: "ONRAMP_INR",
            payload: {
              message: "User doesnt exist",
            },
          });
        }

        RedisManager.getInstance().sendToApi(clientID, {
          type: "ONRAMP_INR",
          payload: {
            message: "Onramp successful",
          },
        });
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "ONRAMP_INR",
          payload: {
            message: "Transaction Failed",
          },
        });
      }
      break;
    case "GET_USER_BALANCE":
      try {
        const { userId } = request.data;

        if (INR_BALANCES.has(userId)) {
          const { balance } = INR_BALANCES.get(userId)!;

          RedisManager.getInstance().sendToApi(clientID, {
            type: "GET_USER_BALANCE",
            payload: {
              message: JSON.stringify(balance),
            },
          });
        } else {
          RedisManager.getInstance().sendToApi(clientID, {
            type: "GET_USER_BALANCE",
            payload: {
              message: "User doesnt exist",
            },
          });
        }
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "GET_USER_BALANCE",
          payload: {
            message: "Unable to fetch data",
          },
        });
      }
      break;
    case "BUY":
      try {
        let { userId, stockSymbol, quantity, price, stockType } =
          request.data;

        // STEP 1:- CHECK FOR SUFFICIENT BALANCE
        const stockCost = quantity * price;

        const userBalance = INR_BALANCES.get(userId)!;

        if (userBalance.balance < stockCost) {
          RedisManager.getInstance().sendToApi(clientID, {
            type: "BUY",
            payload: {
              message: "Insufficient INR balance",
            },
          });
          break;
        }

        // STEP 2:- CHECK FOR STOCK IN ORDERBOOK
        const exists = ORDERBOOK.get(stockSymbol)![stockType];

        if (!exists) {
          // UPDATE ORDERBOOK AND INR_BALANCES
          BUY_ORDER_QUEUE.push({
            userId: userId,
            stockSymbol: stockSymbol,
            quantity: quantity,
            price: price,
            stockType: stockType,
          });

          INR_BALANCES.get(userId)!.balance -= stockCost;
          INR_BALANCES.get(userId)!.locked += stockCost;

          RedisManager.getInstance().sendToApi(clientID, {
            type: "BUY",
            payload: {
              message: "Buy order placed and pending",
            },
          });
          break;
        }

        // STEP 3:- ITERATE SELL_ORDER_QUEUE AND FULFILL THE ORDERS
        const indexesToBeDeleted: number[] = []
        const origQuantity = quantity
        for (let i = 0; i < SELL_ORDER_QUEUE.length; i++) {
          let {
            userId: sellerUserId,
            stockSymbol: sellerstockSymbol,
            quantity: sellerQuantity,
            price: sellerPrice,
            stockType: sellerStockType,
          } = SELL_ORDER_QUEUE[i];

          if (sellerstockSymbol != stockSymbol || sellerStockType != stockType || sellerPrice > price) {
            continue;
          }

          let toBeExecuted = 0;

          if (sellerQuantity <= quantity) {
            indexesToBeDeleted.push(i);
            toBeExecuted = sellerQuantity;
          } else {
            toBeExecuted = quantity
          }

          // SELLER details update
          INR_BALANCES.get(sellerUserId)!.locked -= toBeExecuted*sellerPrice
          STOCK_BALANCES.get(sellerUserId)!.get(stockSymbol)![stockType].locked! -= toBeExecuted;

          const priceKey = (sellerPrice/100).toString();
          ORDERBOOK.get(stockSymbol)![stockType]![priceKey].total -= toBeExecuted
          const prevQuantity = ORDERBOOK.get(stockSymbol)![stockType]![priceKey].orders.get(sellerUserId)!
          ORDERBOOK.get(stockSymbol)![stockType]![priceKey].orders.set(sellerUserId, prevQuantity-toBeExecuted)


          // BUYER details update
          INR_BALANCES.get(userId)!.balance -= toBeExecuted*sellerPrice
          if (STOCK_BALANCES.has(userId)) {
            const userData = STOCK_BALANCES.get(userId)!
            if (userData.has(stockSymbol)) {
              userData.get(stockSymbol)![stockType].quantity += toBeExecuted
            } else {
              userData.set(stockSymbol, {yes: {quantity: 0, locked: 0}, no: {quantity: 0, locked: 0}})
              userData.get(stockSymbol)![stockType].quantity += toBeExecuted
            }
            STOCK_BALANCES.get(userId)!.get(stockSymbol)![stockType].quantity += toBeExecuted
          } else {
            STOCK_BALANCES.set(userId, new Map())
            const userData = STOCK_BALANCES.get(userId)!

            userData.set(stockSymbol, {yes: {quantity: 0, locked: 0}, no: {quantity: 0, locked: 0}})
            userData.get(stockSymbol)![stockType].quantity += toBeExecuted
          }

          quantity -= toBeExecuted;
          sellerQuantity -= toBeExecuted;

          if (sellerQuantity == 0) {
            indexesToBeDeleted.push(i)
          }

          if (quantity == 0) {
            break
          }
        }

        // Delete elements in queue

        let j = 0;
        SELL_ORDER_QUEUE.filter((item, index) => {
          if (index != indexesToBeDeleted[j]) {
            return true
          } else {
            j += 1;
            return false
          }
        })

        if (quantity == 0) {
          RedisManager.getInstance().sendToApi(clientID, {
            type: "BUY",
            payload: {
              message: "Buy order placed and trade executed",
            },
          });
        } else {
          RedisManager.getInstance().sendToApi(clientID, {
            type: "BUY",
            payload: {
              message: `Buy order matched partially, ${quantity} remaining`,
            },
          });
        }
        redisClient.lPush("processedRequests", ORDERBOOK)
      } catch (e) {
        RedisManager.getInstance().sendToApi(clientID, {
          type: "GET_USER_BALANCE",
          payload: {
            message: "Unable to fetch data",
          },
        });
      }
      break;
  }

  console.log("INR_BALANCES:- ", INR_BALANCES);
  console.log("STOCK_BALANCES:- ", STOCK_BALANCES);

  // Processing logic

  // Send to DB to process the request

  // Send it back to queue for websocket server to pick it up
  // redisClient.lPush("processedRequests", "Processing of request is done, here is your result")
}

async function main() {
  try {
    await redisClient.connect();

    console.log("Redis connected, listening to requests");

    while (true) {
      const response = await redisClient.brPop("requests", 0);

      console.log("req check in engine:- ", response);

      await processSubmission(JSON.parse(response.element));
    }
  } catch {}
}

main();
