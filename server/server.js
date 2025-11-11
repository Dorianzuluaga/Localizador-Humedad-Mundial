const express = require("express");


const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is running")
});

app.post("/humidity", (req, res) => {
    const { lat, lng, date } = req.body;
    console.log("Received data:", lat, lng, date);

    res.json({ message: "Humidity data received", lat, lng, date });
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
});