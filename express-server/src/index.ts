import express from "express"
import { createClient } from "redis"
import userRouter from "./routes/userRoutes"
import symbolRouter from "./routes/symbolRoutes"
import getRouter from "./routes/getRoutes"
import stockRouter from "./routes/stockRoutes"
import cors from "cors"

const app = express()
const redisClient = createClient()
app.use(cors({ origin: 'http://localhost:3001' }))
app.use(express.json())

// Routes
app.use('', userRouter)
app.use('', symbolRouter)
app.use('', getRouter)
app.use('/order', stockRouter)

async function startServer() {
    try {
        await redisClient.connect()

        app.listen(3000, () => {
            console.log('Express server is listening on port 3000')
        })

    } catch(e) {
        console.log('error in application:- ', e)
    }
}


startServer()