const express = require("express");
const router = express.Router();

const { getHumidityData } = require("../controllers/humidityController");

router.post("/", getHumidityData)

module.exports = router;