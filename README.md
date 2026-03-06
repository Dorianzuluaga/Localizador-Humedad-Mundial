# Localizador de Humedad Mundial

Este proyecto permite buscar la humedad aproximada de una ubicación, ya sea ingresando coordenadas (latitud y longitud) o el nombre de una región (ciudad, municipio, etc.). Los resultados se almacenan en una base de datos PostgreSQL para su posterior análisis o visualización.

## Tecnologías usadas

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Visualización:** Mapbox + D3
- **Herramientas extra:** Nominatim, DBeaver, CesiumJS, OpenWeather

## Estructura del proyecto

```text
localizador-de-humedad-mundial/
│
├── client/ # Frontend (React + Vite)
│ ├── src/
│ └── ...
│
├── server/ # Backend (Node + Express + PostgreSQL)
│ ├── config/
│ ├── controllers/
│ ├── routes/
│ ├── index.js
│ └── ...
│
├── .env
└── README.md
```

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

git clone https://github.com/Dorianzuluaga/Localizador-Humedad-Mundial.git
cd Localizador-Humedad-Mundial

### 2. Instalar dependencias

- Para el frontend:

  cd client
  npm install

- Para el backend:

  cd ../server
  npm install

### 3. Crear la base de datos en MySQL

Asegúrate de tener PostgreSQL en ejecución. Luego crea una base de datos llamada humidity_db y las siguientes tablas:

CREATE DATABASE humidity_db;

\c humidity_db;

CREATE TABLE locations (
id SERIAL PRIMARY KEY,
region VARCHAR(255),
country VARCHAR(255),
lat FLOAT,
lng FLOAT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE busquedas (
id SERIAL PRIMARY KEY,
lat FLOAT,
lon FLOAT,
date DATE,
humidity INT,
location VARCHAR(255),
region VARCHAR(255),
country VARCHAR(255),
lng FLOAT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

⚙️ El archivo `server/config/db.js` ya está configurado para conectarse a `localhost` con usuario `PostgreSQl`

### 4. Configurar el .env

Ejemplo de variables necesarias:

PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=humidity_db
DB_PORT=5432
OPENWEATHER_API_KEY=tu_api_key

### 5. Ejecutar el proyecto

- Inicia el backend:

  cd server
  npm run dev

- Inicia el frontend:

  cd ../client
  npm run dev

Abre tu navegador en `http://localhost:5173` para ver la aplicación.
