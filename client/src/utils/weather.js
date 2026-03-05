const getHumidityByCoordinates = async (lat, lng, date) => {

    try {
        const response = await fetch("http://localhost:3000/api/humidity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ lat, lng, date }),
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del humedad');
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error en getHumidityByCoordinates", error);
        return null;
    }
};

export default getHumidityByCoordinates;