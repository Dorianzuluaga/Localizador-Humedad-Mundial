const { fetchWeather } = require("../services/weatherService");

const getWeather = async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing lat or lon query parameters" });
    }
    try {
        const weatherData = await fetchWeather(lat, lon);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { getWeather };