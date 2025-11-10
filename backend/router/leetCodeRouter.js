const express = require("express");

const router = express.Router();

const leetCodeRouter = require("../controller/leetCodeController");

router.get("/leetcode/:handler", leetCodeRouter.leetCode);

module.exports = router;
