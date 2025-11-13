const getCoordinates = async (region, country) => {
    const dbResult = await searchByCountryAndRegion(region, country);
    if (dbResult) {
        return { lat: dbResult.lat, lng: dbResult.lng }
    }
    const apiResult = await fetchCoordinatesFromAPI(region, country);
    if (apiResult) {
        await saveCoordinatesToDB(region, country, apiResult.lat, apiResult.lng);
        return { lat: apiResult.lat, lng: apiResult.lng }
    }

    return { lat: null, lng: null }
}

module.exports = { getCoordinates };