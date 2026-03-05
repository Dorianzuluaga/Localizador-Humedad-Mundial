const humidityService = require('../services/humidityService');

const getHumidityData = async (req, res) => {
    console.log(req.body);
    try {
        console.log("BODY RECIBIDO:", req.body);
        const { lat, lng, region, country } = req.body;
        console.log("Received humidity data request:", { lat, lng, region, country });

        if (!lat && !region) {
            return res.status(400).json({ error: "Either 'lat' or 'region' must be provided." });
        }

        const response = await humidityService.getHumidity(lat, lng, region, country);

        if (response.error) {
            return res.status(404).json({ response });
        }

        return res.json({
            message: "consulted humidity data successfully",
            data: response,
        })

    } catch (error) {
        console.error("Error in getHumidityData:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = { getHumidityData };