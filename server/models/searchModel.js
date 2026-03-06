const pool = require('../config/db');

async function saveSearch({ lat, lng, date, humidity, location, region, country }) {
    try {
        await pool.query(
            `INSERT INTO busquedas
            (lat, lon, date, humidity, location, region, country, lng, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
            [lat, lng, date, humidity, location, region, country, lng]
        );
        console.log("Fila insertada en busquedas:", { lat, lng, date, humidity, location, region, country });
    } catch (error) {
        console.error("Error saving search to DB:", error);
    }
}

module.exports = { saveSearch };