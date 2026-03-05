const axios = require("axios");

// consultamos la humedad actual para unas coordenadas dadas
async function fetchWeather(lat, lng) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        console.log("Weather API URL:", url);

        const response = await axios.get(url);


        return {
            name: response.data.name,
            country: response.data.sys.country,
            humidity: response.data.main.humidity,
            temperature: response.data.main.temp,
            coords: response.data.coord
        };
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw new Error("Error fetching weather data");
    };
}

module.exports = { fetchWeather };