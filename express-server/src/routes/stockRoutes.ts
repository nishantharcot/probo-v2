import { Router } from "express";

const stockRouter = Router();

stockRouter.post('/buy')
stockRouter.post('/sell')

export default stockRouter