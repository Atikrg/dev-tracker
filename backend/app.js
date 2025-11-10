const express = require("express");
const scheduleTasks = require("./utils/cron");
const limiterUtils = require("./utils/rateLimiter");

const rateLimiter = limiterUtils.limiter;
const app = express();

app.use(rateLimiter);

scheduleTasks();

const codeChefRouter = require("./router/codeChefRouter");
const leetCodeRouter = require("./router/leetCodeRouter");
const codeForcesRouter = require("./router/codeForcesRouter")

const allCodePlatForm = require("./router/allCodeRouter");

app.use("/api", codeChefRouter);
app.use("/api",leetCodeRouter);
app.use("/api", codeForcesRouter);
app.use("/api", allCodePlatForm);


module.exports = app;
