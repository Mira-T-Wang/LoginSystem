const Redis = require("ioredis");
const redis = new Redis(
    {
        host: "127.0.0.1",
        port: 6379,
    }
);
redis.on("connect", ()=> {
    console.log("Redis Connected Successfully!");
});
redis.on("error",(err)=>{
    console.log("Redis connection error:", err.message);
});

module.exports = redis;