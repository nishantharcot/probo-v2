import express from "express"
import { RedisManager } from "../RedisManager"

export const getOrderBook = async (req: express.Request, res: express.Response) => {
    const response  = await RedisManager.getInstance().sendAndAwait({
        type: 'GET_ORDERBOOK'
    })

    console.log('res check:- ', response.payload)
    res.json(JSON.parse(response.payload.message))
}

export const getOrderBookForEvent = async (req: express.Request, res: express.Response) => {

    const {event} = req.params

    const response  = await RedisManager.getInstance().sendAndAwait({
        type: 'GET_ORDERBOOK_FOR_EVENT',
        data: {
            event
        }
    })

    console.log('res check:- ', response.payload)
    res.json(JSON.parse(response.payload.message))
}

export const getInrBalances = async (req: express.Request, res: express.Response) => {
    const response  = await RedisManager.getInstance().sendAndAwait({
        type: 'GET_INR_BALANCES'
    })

    console.log('res check:- ', response.payload)

    res.json(JSON.parse(response.payload.message))
}

export const getStockBalances = async (req: express.Request, res: express.Response) => {
    const response  = await RedisManager.getInstance().sendAndAwait({
        type: 'GET_STOCK_BALANCES'
    })

    console.log('res check:- ', response.payload)

    res.json(JSON.parse(response.payload.message))
}

export const getUserBalance = async (req: express.Request, res: express.Response) => {
    const {userId} = req.params

    const response  = await RedisManager.getInstance().sendAndAwait({
        type: 'GET_USER_BALANCE',
        data: {
            userId
        }
    })

    res.json(response.payload)

}