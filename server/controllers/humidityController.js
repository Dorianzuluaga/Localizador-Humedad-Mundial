const geocodeService = require('../services/geocodeService');

const getHumidityData = async (req, res) => {
    try {
        const { lat, lng, date, region, country } = req.body;
        console.log("Received humidity data request:", { lat, lng, date, region, country });

        if (!lat && !region) {
            return res.status(400).json({ error: "Either 'lat' or 'region' must be provided." });
        }
        let searchType = "";
        if (lat && lng) searchType = "coordinates";
        else searchType = "name";
        console.log("tipology of search:", searchType);

        let result = null; Ç
        if (searchType === "coordinates") {
            //fake data for demonstration
            result = "humidity: 75, source: 'coordinates-based-data'";
        }
        if (searchType === "name") {
            //fake data for demonstration
            result = "humidity: 80, source: 'name-based-data'";
        }
        return res.json({
            message: "consulted humidity data successfully",
            type: searchType,
            data: { lat, lng, date, region, country }
        })

    } catch (error) {
        console.error("Error in getHumidityData:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = { getHumidityData };