const { searchByName } = require('../models/geocodeModel');
const pool = require('../config/db');

// transformar region y country en lat y lng
const getCoordinates = async (region, country) => {
    try {
        const dbResult = await searchByName(region, country);

        if (dbResult.length > 0) {
            const row = dbResult[0];
            return { lat: row.lat, lng: row.lng, from: 'database' };
        }

        const apiResult = await fetchCoordinatesFromAPI(region, country);

        if (apiResult && apiResult.lat && apiResult.lng) {
            await saveCoordinatesToDB(region, country, apiResult.lat, apiResult.lng);
            return { lat: apiResult.lat, lng: apiResult.lng, from: 'api' };
        }

        return { lat: null, lng: null, from: 'not found' };

    } catch (error) {
        console.error("Error in getCoordinates:", error);
        return { error: "Failed to fetch coordinates" };
    }
};

// FAKE API
async function fetchCoordinatesFromAPI(region, country) {
    return { lat: 40.7128, lng: -74.0060 };
}

async function saveCoordinatesToDB(region, country, lat, lng) {
    try {
        await pool.query(
            "INSERT INTO locations (region, country, lat, lng) VALUES (?, ?, ?, ?)",
            [region, country, lat, lng]
        );
    } catch (error) {
        console.error("Error saving coordinates to DB:", error);
    }
}

module.exports = { getCoordinates };
