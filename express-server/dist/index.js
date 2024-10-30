"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const symbolRoutes_1 = __importDefault(require("./routes/symbolRoutes"));
const getRoutes_1 = __importDefault(require("./routes/getRoutes"));
const app = (0, express_1.default)();
const redisClient = (0, redis_1.createClient)();
app.use(express_1.default.json());
// Routes
app.use('', userRoutes_1.default);
app.use('', symbolRoutes_1.default);
app.use('', getRoutes_1.default);
// app.post('/connectionTest', async (req, res) => {
//     redisClient.lPush("requests", "Hi. I'm pushing on the queue. Can you reveive this?")
//     res.status(200).send("connection established!")
// })
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            app.listen(3000, () => {
                console.log('Express server is listening on port 3000');
            });
        }
        catch (_a) {
            console.log('error in application');
        }
    });
}
startServer();
