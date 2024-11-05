import mongoose from "mongoose";
import { createClient } from "redis";
mongoose.connect(
  "mongodb+srv://NishanthProbo:Test1234@probo-db.ugr7ecq.mongodb.net/"
);

async function main() {
  const redisClient = createClient();
  await redisClient.connect();

  while (true) {
    const response = await redisClient.brPop("db_server", 0)

    console.log('res check from archiver:- ', response)
  }
}


main();
