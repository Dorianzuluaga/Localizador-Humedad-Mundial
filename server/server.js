const express = require("express");
const app = express();

app.use(express.json())

const humidityRoutes = require("./routes/humidityRoutes");
console.log("✅ Archivo de rutas importado correctamente");

console.log("🛣 Registrando ruta /humidity");

app.use("/humidity", humidityRoutes);

app.get("/", (req, res) => {
    res.send("Server is running")
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
console.log("🚀 Servidor listo para recibir peticiones POST /humidity");
