import React, { useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getColorForHumidity from "../utils/humidityUtils";
import WidgetCircular from "./WidgetCircular";
import { useDispatch } from "react-redux";
import { setCoordinates } from "../store/coordinatesSlice";
import { getInitialMapSettings } from "../utils/mapSettings";
import SearchBox from "./SearchBox";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9yaWFuenVsdWFnYSIsImEiOiJjbWN4bXhoN3UwMGdjMmxxbjljOWt5emR6In0.II_rIDIKtcoHV6kQRA8N2w";

function Map() {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const handleSearch = ({ lat, lon, place_type, name }) => {
    dispatch(setCoordinates({ lat, lng: lon, placeName: name || "" }));

    if (mapInstance.current) {
      // 🗺️ Definir zoom según tipo de lugar
      let zoom = 12; // default
      if (place_type?.includes("poi")) zoom = 16;
      else if (place_type?.includes("locality")) zoom = 14;
      else if (place_type?.includes("place")) zoom = 13;
      else if (place_type?.includes("region")) zoom = 12;
      else if (place_type?.includes("country")) zoom = 5;

      // 🚀 Animar vuelo al punto
      mapInstance.current.flyTo({
        center: [lon, lat],
        zoom,
        speed: 1.4,
        curve: 1,
        essential: true,
      });

      // 📍 Agregar popup con el nombre del sitio
      if (name) {
        new mapboxgl.Popup()
          .setLngLat([lon, lat])
          .setHTML(`<strong>${name}</strong>`)
          .addTo(mapInstance.current);
      }

      // 🔥 (Opcional) Actualizar capa de calor según coordenadas buscadas
      if (mapInstance.current.getSource("humidity-points")) {
        const newFeature = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lon, lat] },
          properties: {
            humidity: Math.floor(Math.random() * 100), // valor temporal
          },
        };

        mapInstance.current.getSource("humidity-points").setData({
          type: "FeatureCollection",
          features: [newFeature],
        });
      }
    }
  };

  // aquí son los puntos de humedad creados manualmente
  // const humidityPoints = useMemo(
  //   () => [
  //     { coordinates: [-3.71785, 40.42821], humidity: 92 },
  //     { coordinates: [-2.9157, 43.2545], humidity: 20 },
  //     { coordinates: [-1.5, 42.5], humidity: 50 },
  //     { coordinates: [1.5, 41.0], humidity: 80 },
  //     { coordinates: [0.5, 40.0], humidity: 30 },
  //   ],
  //   []
  // );

  useEffect(() => {
    if (!mapRef.current) return;

    const humidityGeoJSON = {
      type: "FeatureCollection",
      features: [], // inicialmente vacío
    };

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      zoom: 1,
      center: [-3.7, 40.4], //lon, lat
    });

    mapInstance.current = map;

    // damos el estilo al mapa
    map.on("style.load", () => {
      const { zoom, curve, speed } = getInitialMapSettings();
      map.flyTo({
        center: [-3.7, 40.4],
        zoom,
        speed,
        curve,
        easing: (t) => t,
      });
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(
        new mapboxgl.FullscreenControl({
          container: document.querySelector(".map-container"),
        })
      );

      map.addControl(new mapboxgl.ScaleControl(), "top-left");

      map.addSource("humidity-points", {
        type: "geojson",
        data: humidityGeoJSON,
      });

      map.addLayer({
        id: "humidity-heatmap",
        type: "heatmap",
        source: "humidity-points",
        maxzoom: 24,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "humidity"],
            0,
            0,
            100,
            1,
          ],
          "heatmap-intensity": 2,
          "heatmap-radius": 40,
          "heatmap-opacity": 0.8,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
        },
      });

      map.setFog({});

      // map.on("click", (e) => {
      //   const { lng, lat } = e.lngLat;
      //   dispatch(setCoordinates({ lat: lat.toFixed(5), lng: lng.toFixed(5) }));
      // });

      map.on("click", async (e) => {
        const { lng, lat } = e.lngLat;
        const latFixed = lat.toFixed(5);
        const lngFixed = lng.toFixed(5);
        const center = { lat: parseFloat(latFixed), lng: parseFloat(lngFixed) };

        try {
          const token =
            "pk.eyJ1IjoiZG9yaWFuenVsdWFnYSIsImEiOiJjbWN4bXhoN3UwMGdjMmxxbjljOWt5emR6In0.II_rIDIKtcoHV6kQRA8N2w";
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngFixed},${latFixed}.json?access_token=${token}`
          );
          const data = await response.json();

          // Tomamos el nombre más relevante del primer resultado
          const placeName =
            data.features?.[0]?.place_name || "location not found";

          // Guardamos en Redux
          dispatch(
            setCoordinates({
              lat: latFixed,
              lng: lngFixed,
              placeName,
            })
          );

          // 🔹 Generamos puntos alrededor del clic (radio aproximado 10–20 km)
          const newHumidityData = {
            type: "FeatureCollection",
            features: Array.from({ length: 25 }, () => {
              const offsetLat = (Math.random() - 0.5) * 0.2; // ±0.1°
              const offsetLng = (Math.random() - 0.5) * 0.2;
              const randomHumidity = Math.floor(Math.random() * 100);
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [center.lng + offsetLng, center.lat + offsetLat],
                },
                properties: {
                  humidity: randomHumidity,
                  color: getColorForHumidity(randomHumidity),
                },
              };
            }),
          };

          // 🔹 Actualizamos la fuente del heatmap
          const source = map.getSource("humidity-points");
          if (source) {
            source.setData(newHumidityData);
          } else {
            console.warn(
              "La fuente 'humidity-points' no está disponible todavía."
            );
          }

          // 🔹 Añadimos el popup
          new mapboxgl.Popup()
            .setLngLat([lng, lat])
            .setHTML(`<strong>${placeName}</strong>`)
            .addTo(map);
        } catch (error) {
          console.error("Error obteniendo el nombre del sitio:", error);
        }
      });

      // new mapboxgl.Marker().setLngLat([-3.71785, 40.42821]).addTo(map); //lon,lat

      // new mapboxgl.Marker({ color: "black" })
      //   .setLngLat([-2.9157, 43.2545]) //lon,lat
      //   .addTo(map);

      // con bound lo que hago es centrar el mapa en las coordenadas y
      // para que los marcadores no se me pierdan de vista, para esto tambien tuve que importar css de mapbox
      // const bounds = new mapboxgl.LngLatBounds();

      // bounds.extend([-3.71785, 40.42821]); //lon,lat
      // bounds.extend([-2.9157, 43.2545]); //lon,lat
      // map.fitBounds(bounds, { padding: 50, maxZoom: 1.8 });

      const handleResize = () => map.resize();
      window.addEventListener("resize", handleResize);

      setTimeout(() => {
        map.resize();
      }, 200);

      return () => {
        map.remove();
        window.removeEventListener("resize", handleResize);
      };
    });
  }, [dispatch]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="mapita"></div>
      <div>
        <SearchBox onSearch={handleSearch} />
      </div>

      <div className="widget-container">
        <WidgetCircular />
      </div>
    </div>
  );
}

export default Map;
