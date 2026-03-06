const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getHumidityByCoordinates = async (lat, lng, date) => {

    try {
        const response = await fetch(`${API_BASE_URL}/humidity`, {
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