require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/weather', require('./routes/weatherRoutes'));


app.use('/api/humidity', require('./routes/humidityRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;