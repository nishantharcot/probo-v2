import { RedisManager } from '../RedisManager.js';
import express from "express"

export const createUser = async (req: express.Request, res: express.Response) => {
  const {userId} = req.params;

  const response = await RedisManager.getInstance().sendAndAwait({
    type: 'CREATE_USER',
    data: {
      userId
    }
  })

  console.log('response check in express server:- ', response)

  res.json(response.payload);

};

export const resetData = async (req:express.Request, res:express.Response) => {
  const response = await RedisManager.getInstance().sendAndAwait({
    type: 'RESET_DATA',
  })

  res.json(response.payload)
}

export const onrampInr = async (req:express.Request, res:express.Response) => {
  const {userId, amount} = req.body

  const response = await RedisManager.getInstance().sendAndAwait({
    type: 'ONRAMP_INR',
    data: {
      userId,
      amount
    }
  })

  res.json(response.payload)
}