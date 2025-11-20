const express = require("express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

const humidityRoutes = require('./routes/humidityRoutes');
app.use('/api/humidity', humidityRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;