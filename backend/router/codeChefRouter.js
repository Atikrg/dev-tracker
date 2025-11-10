const express = require("express");
const router = express.Router();


const codeChefController = require("../controller/codeChefController");

router.get("/codechef/:handler", codeChefController.codeChef);

module.exports = router;