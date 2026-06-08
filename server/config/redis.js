import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.log("redis client error", err);
  process.exit(1);
});

await redisClient.connect();

export default redisClient;
