import express from "express"
import { createClient } from "redis"
import userRouter from "./routes/userRoutes"

const app = express()
const redisClient = createClient()
app.use(express.json())

// Routes
app.use('', userRouter)


// app.post('/connectionTest', async (req, res) => {
//     redisClient.lPush("requests", "Hi. I'm pushing on the queue. Can you reveive this?")
//     res.status(200).send("connection established!")
// })

async function startServer() {
    try {
        await redisClient.connect()

        app.listen(3000, () => {
            console.log('Express server is listening on port 3000')
        })

    } catch {
        console.log('error in application')
    }
}


startServer()