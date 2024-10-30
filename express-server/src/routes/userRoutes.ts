import express from 'express';
import { createUser, resetData, onrampInr } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/user/create/:userId', createUser);
userRouter.post('/reset', resetData)
userRouter.post('/onramp/inr', onrampInr)

export default userRouter;
