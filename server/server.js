const express = require("express");
const app = express();

app.use(express.json())

const humidityRoutes = require("./routes/humidityRoutes");
console.log("✅ Archivo de rutas importado correctamente");


app.use("/api/humidity", humidityRoutes);

app.get("/", (req, res) => {
    res.send("Server is running")
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});