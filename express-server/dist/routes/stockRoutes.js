"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const stockRouter = (0, express_1.Router)();
stockRouter.post('/buy', stockController_1.buyStock);
stockRouter.post('/sell', stockController_1.sellStock);
exports.default = stockRouter;
