import { RedisManager } from '../RedisManager.js';
import express from "express"

export const createUser = async (req: express.Request, res: express.Response) => {
  // console.log('req check:- ', req)
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