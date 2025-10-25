const getWeatherByCoordinates = async (lat, lon) => {

    try {
        const response = await fetch(`http://localhost:3001/api/weather?lat=${lat}&lon=${lon}`);

        if (!response.ok) {
            throw new Error('Error al obtener los datos del clima');
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error en getWeatherByCoordinates", error);
        return null;
    }
};

export default getWeatherByCoordinates;