const pool = require('../db');


const searchByCountryAndRegion = async (region, country) => {
    try {
        const [rows] = await pool.query("SELECT lat, lng FROM geocodes WHERE region = ? AND country = ?", [region, country]);
        if (rows.length > 0) {
            return { lat: rows[0].lat, lng: rows[0].lng };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error searching geocode in DB:", error);
        return null;
    }
}

module.exports = { searchByCountryAndRegion };
