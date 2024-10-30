"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const symbolController_1 = require("../controllers/symbolController");
const symbolRouter = (0, express_1.Router)();
symbolRouter.post('/symbol/create/:stockSymbol', symbolController_1.createSymbol);
exports.default = symbolRouter;
