"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
userRouter.post('/user/create/:userId', userController_1.createUser);
userRouter.post('/reset', userController_1.resetData);
userRouter.post('/onramp/inr', userController_1.onrampInr);
userRouter.post('/trade/mint', userController_1.mintTokens);
exports.default = userRouter;
