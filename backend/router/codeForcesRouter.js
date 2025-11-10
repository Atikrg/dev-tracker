const express = require("express");

const router = express.Router();

const codeForcesRouter = require("../controller/codeForceController");

router.get("/codeforces/:handler", codeForcesRouter.codeForces);

module.exports = router;
