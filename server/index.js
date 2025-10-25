const express = require("express");
const cors = require("cors");
const axios = require("axios");


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitud y longitus son requeridas" })
    }
    try {
        const apiKey = "15dd0e113098e35112af5988499246fb";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const result = {
            name: data.name,
            country: data.sys.country,
            humidity: data.main.humidity,
            temperature: data.main.temp,
            coords: data.coord
        };

        res.json(result);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al consultar openWeather" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});