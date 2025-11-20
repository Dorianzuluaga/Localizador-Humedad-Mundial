const pool = require('../config/db');


async function searchByCoordenates(lat, lng) {
    const [rows] = await pool.query(
        "SELECT * FROM locations WHERE lat = ? AND lng = ?",
        [lat, lng]
    ); return rows;

}

async function searchByName(region, country) {
    const [rows] = await pool.query(
        "SELECT * FROM locations WHERE region = ? AND country = ?",
        [region, country]
    ); return rows;
}
module.exports = { searchByCoordenates, searchByName };