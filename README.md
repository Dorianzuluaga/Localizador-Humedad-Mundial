# Localizador de Humedad Mundial

Este proyecto permite buscar la humedad aproximada de una ubicación, ya sea ingresando coordenadas (latitud y longitud) o el nombre de una región (ciudad, municipio, etc.). Los resultados se almacenan en una base de datos para su posterior análisis o visualización.

## Tecnologías usadas

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Visualización:** Mapbox + D3
- **Herramientas extra:** Nominatim, DBeaver, CesiumJS (futuro)

## Estructura del proyecto

```
localizador-de-humedad-mundial/
│
├── client/        # Frontend (React + Vite)
│   ├── src/
│   └── ...
│
├── server/        # Backend (Node + Express + MySQL)
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── index.js
│   └── ...
│
└── README.md      # Este archivo
```

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd localizador-de-humedad-mundial
```

### 2. Instalar dependencias

- Para el frontend:

  ```bash
  cd client
  npm install
  ```

- Para el backend:

  ```bash
  cd ../server
  npm install
  ```

### 3. Crear la base de datos en MySQL

Asegúrate de tener MySQL en ejecución. Luego crea una base de datos llamada `localizador` y la siguiente tabla:

```sql
CREATE DATABASE localizador;

USE localizador;

CREATE TABLE busquedas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat VARCHAR(255),
  lon VARCHAR(255),
  date DATE,
  humidity INT,
  location VARCHAR(255)
);
```

⚙️ El archivo `server/config/db.js` ya está configurado para conectarse a `localhost` con usuario `root` sin contraseña.

### 4. Ejecutar el proyecto

- Inicia el backend:

  ```bash
  cd server
  node index.js
  ```

- Inicia el frontend:

  ```bash
  cd ../client
  npm run dev
  ```

Abre tu navegador en `http://localhost:5173` para ver la aplicación.

---

### Asegúrate de que MySQL esté corriendo

Si usas macOS con Homebrew, puedes iniciar MySQL con:

```bash
mysql.server start
```

También puedes verificar si está activo con:

```bash
mysqladmin -u root status
```
