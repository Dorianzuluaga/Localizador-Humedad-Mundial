


function getColorForHumidity(humidity) {
    if (humidity < 30) {
        return 'red'; // Baja humedad
    } else if (humidity >= 30 && humidity < 60) {
        return 'yellow'; // Media humedad
    } else if (humidity >= 60 && humidity < 80) {
        return 'blue'; // Alta humedad
    } else {
        return 'green'; // Humedad muy alta
    }
}

export default getColorForHumidity;