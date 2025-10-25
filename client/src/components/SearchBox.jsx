import React, { useState, useEffect } from "react";
import "../styles/SearchBox.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZG9yaWFuenVsdWFnYSIsImEiOiJjbWN4bXhoN3UwMGdjMmxxbjljOWt5emR6In0.II_rIDIKtcoHV6kQRA8N2w"; // ya lo tienes en tu .env

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (hasSelected) {
      setHasSelected(false); // reiniciamos flag
      return; // no hacemos fetch
    }
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Detectar coords
    const coords = query.split(",").map((item) => item.trim());
    const isCoords =
      coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]);

    if (!isCoords) {
      // Autocomplete Mapbox
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?autocomplete=true&limit=5&access_token=${MAPBOX_TOKEN}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.features || []);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.place_name);
    setSuggestions([]);
    setHasSelected(true);
    const [lon, lat] = item.center;
    onSearch({
      lat,
      lon,
      place_type: item.place_type || [],
      name: item.place_name,
    });
  };

  const handleSearch = async () => {
    const coords = query.split(",").map((item) => item.trim());
    const isCoords =
      coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]);

    if (isCoords) {
      // 👉 Si el usuario introduce coordenadas manualmente
      const lat = parseFloat(coords[0]);
      const lon = parseFloat(coords[1]);

      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await res.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          onSearch({
            lat,
            lon,
            place_type: feature.place_type, // tipo de lugar
            name: feature.place_name, // nombre completo del sitio
          });
        } else {
          // Si no hay resultado, al menos centra el mapa
          onSearch({ lat, lon });
        }
      } catch (err) {
        console.error("Error buscando coordenadas:", err);
        onSearch({ lat, lon });
      }
    } else {
      // 👉 Si el usuario busca por nombre
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?limit=1&access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lon, lat] = feature.center;

        onSearch({
          lat,
          lon,
          place_type: feature.place_type, // tipo de lugar
          name: feature.place_name, // nombre completo
        });
      }
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search by name or coordinates"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            setActiveIndex((prev) =>
              Math.min(prev + 1, suggestions.length - 1)
            );
          } else if (e.key === "ArrowUp") {
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          } else if (e.key === "Enter" && activeIndex >= 0) {
            handleSelect(suggestions[activeIndex]);
          }
        }}
      />
      <button onClick={handleSearch}>Search</button>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              className={index === activeIndex ? "active" : ""}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {item.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
