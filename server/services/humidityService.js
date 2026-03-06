const geocodeService = require("../services/geocodeService");
const weatherService = require("../services/weatherService");
const searchModel = require("../models/searchModel");

async function getHumidity(lat, lng, region, country) {
    try {
        console.log("Fetching humidity with params:", { lat, lng, region, country });

        const coords = await geocodeService.getCoordinates(region, country, lat, lng);
        lat = coords.lat;
        lng = coords.lng;

        if (!lat && !lng) {
            return { error: "Coordinates not found for this search" };
        }

        const weather = await weatherService.fetchWeather(lat, lng);
        console.log("Weather response:", weather);

        await searchModel.saveSearch({
            lat,
            lng,
            date: new Date(),
            humidity: weather.humidity,
            location: weather.name,
            region,
            country
        });

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