useEffect(() => {
    if (!mapRef.current) return;

    const humidityGeoJSON = {
        type: "FeatureCollection",
        features: humidityPoints.map((point) => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: point.coordinates,
            },
            properties: {
                humidity: point.humidity,
                color: getColorForHumidity(point.humidity),
            },
        })),
    };

    const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/standard-satellite",
        zoom: 1,
        center: [-3.7, 40.4], //lon, lat
    });

    // damos el estilo al mapa y le añadimos las capas como humedad y los marcadores de ubicación mediante lat y lon
    map.on("style.load", () => {
        map.flyTo({
            center: [-3.7, 40.4],
            zoom: 2,
            speed: 0.1, // Velocidad de vuelo 1 es lento, 10 es instantáneo)
            curve: 1.45, // Curva de movimiento
            easing: (t) => t,
        });
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.addControl(new mapboxgl.FullscreenControl(), "top-right");
        map.addControl(new mapboxgl.ScaleControl(), "top-left");

        map.addSource("humidity-points", {
            type: "geojson",
            data: humidityGeoJSON,
        });

        // map.addLayer({
        //   id: "humidity-heatmap",
        //   type: "heatmap",
        //   source: "humidity-points",
        //   maxzoom: 24,
        //   paint: {
        //     "heatmap-weight": [
        //       "interpolate",
        //       ["linear"],
        //       ["get", "humidity"],
        //       0,
        //       0,
        //       100,
        //       1,
        //     ],
        //     "heatmap-intensity": 2,
        //     "heatmap-radius": 40,
        //     "heatmap-opacity": 0.8,
        //     "heatmap-color": [
        //       "interpolate",
        //       ["linear"],
        //       ["heatmap-density"],
        //       0,
        //       "rgba(33,102,172,0)",
        //       0.2,
        //       "rgb(103,169,207)",
        //       0.4,
        //       "rgb(209,229,240)",
        //       0.6,
        //       "rgb(253,219,199)",
        //       0.8,
        //       "rgb(239,138,98)",
        //       1,
        //       "rgb(178,24,43)",
        //     ],
        //   },
        // });

        map.setFog({});

        map.on("click", (e) => {
            const { lng, lat } = e.lngLat;
            dispatch(setCoordinates({ lat: lat.toFixed(5), lng: lng.toFixed(5) }));
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
}, [humidityPoints, dispatch]);