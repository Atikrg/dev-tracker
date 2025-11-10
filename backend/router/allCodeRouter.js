const express = require("express");
const router = express.Router();

const allCodePlatformsController = require("../controller/allCodePlatformsController");

router.get("/fetch-all-ratings/:handler", allCodePlatformsController.allCodePlatforms);


module.exports = router;