import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getColorForHumidity from "../utils/humidityUtils";
import WidgetCircular from "./WidgetCircular";
import { useDispatch } from "react-redux";
import { setCoordinates } from "../store/coordinatesSlice";
import { getInitialMapSettings } from "../utils/mapSettings";
import SearchBox from "./SearchBox";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const rotateAnimation = useRef(null);
  const isRotating = useRef(true);

  const startRotation = () => {
    if (!mapInstance.current) return;

    const rotateMap = () => {
      if (!mapInstance.current || !isRotating.current) return;

      const currentBearing = mapInstance.current.getBearing();

      mapInstance.current.setBearing(currentBearing - 0.03);

      rotateAnimation.current = requestAnimationFrame(rotateMap);
    };

    rotateMap();
  };

  const stopRotation = () => {
    isRotating.current = false;
    if (rotateAnimation.current) cancelAnimationFrame(rotateAnimation.current);
  };

  const resumeRotation = () => {
    if (!mapInstance.current) return;

    isRotating.current = true;
    startRotation();
  };

  const handleSearch = ({ lat, lon, place_type, name }) => {
    dispatch(setCoordinates({ lat, lng: lon, placeName: name || "" }));

    if (mapInstance.current) {
      stopRotation();

      let zoom = 12;
      if (place_type?.includes("poi")) zoom = 16;
      else if (place_type?.includes("locality")) zoom = 14;
      else if (place_type?.includes("place")) zoom = 13;
      else if (place_type?.includes("region")) zoom = 12;
      else if (place_type?.includes("country")) zoom = 5;

      mapInstance.current.flyTo({
        center: [lon, lat],
        zoom,
        speed: 1.4,
        curve: 1,
        essential: true,
      });

      if (name) {
        new mapboxgl.Popup()
          .setLngLat([lon, lat])
          .setHTML(`<strong>${name}</strong>`)
          .addTo(mapInstance.current);
      }

      setTimeout(resumeRotation, 3000);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const humidityGeoJSON = {
      type: "FeatureCollection",
      features: [],
    };

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      zoom: 1,
      center: [-3.7, 40.4],
    });

    mapInstance.current = map;

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
        }),
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

      startRotation();

      map.on("click", async (e) => {
        stopRotation();

        const { lng, lat } = e.lngLat;
        const latFixed = parseFloat(lat.toFixed(5));
        const lngFixed = parseFloat(lng.toFixed(5));

        try {
          const token = mapboxgl.accessToken;

          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngFixed},${latFixed}.json?access_token=${token}`,
          );

          const data = await response.json();

          const placeName =
            data.features?.[0]?.place_name || "location not found";

          dispatch(
            setCoordinates({
              lat: latFixed,
              lng: lngFixed,
              placeName,
            }),
          );

          const center = { lat: latFixed, lng: lngFixed };

          const newHumidityData = {
            type: "FeatureCollection",
            features: Array.from({ length: 25 }, () => {
              const offsetLat = (Math.random() - 0.5) * 0.2;
              const offsetLng = (Math.random() - 0.5) * 0.2;

              const humidity = Math.floor(Math.random() * 100);

              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [center.lng + offsetLng, center.lat + offsetLat],
                },
                properties: {
                  humidity,
                  color: getColorForHumidity(humidity),
                },
              };
            }),
          };

          const source = map.getSource("humidity-points");

          if (source) source.setData(newHumidityData);

          new mapboxgl.Popup()
            .setLngLat([lng, lat])
            .setHTML(`<strong>${placeName}</strong>`)
            .addTo(map);

          setTimeout(resumeRotation, 3000);
        } catch (error) {
          console.error("Error obteniendo el nombre del sitio:", error);
        }
      });

      const handleResize = () => map.resize();

      window.addEventListener("resize", handleResize);

      setTimeout(() => map.resize(), 200);

      return () => {
        cancelAnimationFrame(rotateAnimation.current);
        map.remove();
        window.removeEventListener("resize", handleResize);
      };
    });
  }, [dispatch]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="mapita"></div>

      <SearchBox onSearch={handleSearch} />

      <div className="widget-container">
        <WidgetCircular />
      </div>
    </div>
  );
}

export default Map;
