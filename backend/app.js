const express = require("express");
const scheduleTasks = require("./utils/cron");
const limiterUtils = require("./utils/rateLimiter");
const cors = require("cors");
const rateLimiter = limiterUtils.limiter;
const app = express();

console.log("frontend url in backend", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(rateLimiter);

scheduleTasks();

const codeChefRouter = require("./router/codeChefRouter");
const leetCodeRouter = require("./router/leetCodeRouter");
const codeForcesRouter = require("./router/codeForcesRouter");

const allCodePlatForm = require("./router/allCodeRouter");

app.use("/api", codeChefRouter);
app.use("/api", leetCodeRouter);
app.use("/api", codeForcesRouter);
app.use("/api", allCodePlatForm);

module.exports = app;
