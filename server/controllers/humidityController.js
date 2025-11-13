const getHumidityData = (req, res) => {
    const { lat, lng, date } = req.body;
    console.log("datos recibidos en controller:", lat, lng, date, region, country);
    res.json({ message: "Humidity data received", lat, lng, date, region, country });
};
module.exports = { getHumidityData };