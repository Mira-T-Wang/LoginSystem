const jwt = require('jsonwebtoken');
const redis = require('../db/redis');

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;// read only httpOnly cookie

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //check if token has been denylisted 
    try {
      const isDenyListed = await redis.get (`denylist:${token}`);
      if (isDenyListed) {
        return res.status(401).json({ message: 'Not authorized, token revoked'});
      }
    } catch (redisErr) {
      console.warn('Redis denylist check failed, skipping:', redisErr.message);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = requireAuth;