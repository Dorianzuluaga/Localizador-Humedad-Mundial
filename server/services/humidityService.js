const geocodeService = require("../services/geocodeService");
const weatherService = require("../services/weatherService");

async function getHumidity(lat, lng, region, country) {
    try {
        console.log("Fetching humidity with params:", { lat, lng, region, country });

        if (!lat && region) {
            const coords = await geocodeService.getCoordinates(region, country);
            lat = coords.lat;
            lng = coords.lng;
        }
        if (!lat && !lng) {
            return { error: "Coordinates not found for this search" };
        }

        const weather = await weatherService.fetchWeather(lat, lng);
        console.log("Weather response:", weather);
        return {
            lat,
            lng,
            humidity: weather.humidity,
            temperature: weather.temperature,
            locationName: weather.name,
            country: weather.country,
            source: "weather-api",
        };
    } catch (error) {
        console.error("Error in getHumidity:", error);
        return { error: "Failed to fetch humidity data" };
    }
}
module.exports = { getHumidity };