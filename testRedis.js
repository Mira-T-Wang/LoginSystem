const redis = require("./server/db/redis");

async function test() {
  await redis.set("greeting", "Redis is working!");
  const value = await redis.get("greeting");
  console.log("Value from Redis:", value);
  redis.quit();
}

test();