const Redis = require("ioredis");
const redis = new Redis(
    {
        host: "127.0.0.1",
        port: 6379,
         maxRetriesPerRequest: 1,
        retryStrategy: () => null,
    }
);
redis.on("connect", ()=> {
    console.log("Redis Connected Successfully!");
});
redis.on("error",(err)=>{
    if (err.code === "ECONNREFUSED") return;
    console.log("Redis connection error:", err.message);
});

module.exports = redis;