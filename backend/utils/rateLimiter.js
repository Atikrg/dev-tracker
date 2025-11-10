const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: "Too many requests, chill for a minute!",
  standardHeaders: true,
  legacyHeaders: false,
});
