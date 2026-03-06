// server.js
const express = require("express");
const cors = require("cors"); // Para evitar problemas de CORS
const app = express();

// Permite recibir JSON en el body
app.use(express.json());

// Configuración CORS
// Reemplaza con tu URL de frontend en Render
app.use(cors({
    origin: "https://humidity-front.onrender.com",
    methods: ["GET", "POST"],
}));

// Importar rutas
const humidityRoutes = require("./routes/humidityRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

console.log("Archivos de rutas importados correctamente");

// Definir rutas
app.use("/api/humidity", humidityRoutes);
app.use("/api/weather", weatherRoutes);

// Ruta raíz para verificar que el servidor corre
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Puerto dinámico (Render asigna uno con process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});