const geocodeService = require("../services/geocodeService");
const weatherService = require("../services/weatherService");

async function getHumidity(lat, lng, region, country) {
    if (!lat && region) {
        const coords = await geocodeService.getCoordinates(region, country);
        lat = coords.lat;
        lng = coords.lng;
    }
    if (!lat && !lng) {
        return { error: "Coordinates not found for this search" };
    }

    const weather = await weatherService.fetchWeather(lat, lng);
    return {
        lat,
        lng,
        humidity: weather.humidity,
        temperature: weather.temperature,
        locoationName: weather.name,
        country: weather.country,
        source: "weather-api"
    };
}
module.exports = { getHumidity };