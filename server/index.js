require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/weather', require('./routes/weatherRoutes'));


app.use('/api/humidity', require('./routes/humidityRoutes'));

const pool = require('./config/db');

pool.query('SELECT NOW()')
    .then(res => console.log('PostgreSQL conectado:', res.rows))
    .catch(err => console.error('Error conexión PostgreSQL:', err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;