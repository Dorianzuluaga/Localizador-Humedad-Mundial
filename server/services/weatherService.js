const axios = require("axios");

// consultamos la humedad actual para unas coordenadas dadas
async function fetchWeather(lat, lon) {
    try {
        // const apiKey = "15dd0e113098e35112af5988499246fb";
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
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