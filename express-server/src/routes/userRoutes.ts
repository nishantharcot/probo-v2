import express from 'express';
import { createUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/user/create/:userId', createUser);

export default userRouter;
