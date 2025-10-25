import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "../styles/WidgetCircular.css";
import { useSelector } from "react-redux";
import getWeatherByCoordinates from "../utils/weather";

function WidgetCircular() {
  const coordinates = useSelector((state) => state.coordinates);
  const svgRef = useRef();

  const [humidityPercent, setHumidityPercent] = useState(0);

  useEffect(() => {
    const fetchHumidity = async () => {
      if (coordinates.lat && coordinates.lng) {
        try {
          const data = await getWeatherByCoordinates(
            coordinates.lat,
            coordinates.lng
          );
          if (data && data.humidity !== undefined) {
            setHumidityPercent(data.humidity);
          } else {
            setHumidityPercent(0);
          }
        } catch (error) {
          console.error("Error al obtener la humedad", error);
          setHumidityPercent(0);
        }
      }
    };

    fetchHumidity();
  }, [coordinates]);

  useEffect(() => {
    const percent = Math.max(0, Math.min(100, humidityPercent));
    const radius = 40;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const group = svg
      .attr("width", 100)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(50, 50)");

    // Fondo del círculo
    group
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", strokeWidth);

    // para llenar el progreso
    const progressCircle = group
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#3bb7c2ff")
      .attr("stroke-width", strokeWidth)
      .attr("stroke-dasharray", circumference)
      .attr("stroke-dashoffset", circumference)
      .attr("stroke-linecap", "round")
      .attr("transform", "rotate(-90)");

    progressCircle
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", offset);

    // Para el texto en el centro del circulo
    group
      .append("text")
      .text(`${percent}%`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .style("font-size", "18px");

    svg
      .append("text")
      .text("Humidity")
      .attr("x", 50) // centro del SVG
      .attr("y", 70) // para ajustar la altura
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "10px")
      .style("font-family", "sans-serif");
  }, [humidityPercent]);

  return (
    <div className="humidity-card">
      <svg ref={svgRef}></svg>
      <div className="humidity-info">
        <div>
          {coordinates.placeName && (
            <p className="title">
              <span role="img" aria-label="place">
                📍
              </span>{" "}
              {coordinates.placeName}
            </p>
          )}
        </div>
        <p>coordenates:</p>
        <div className="coordinates">
          <p>Lat: {coordinates.lat}</p>
          <p>Lng: {coordinates.lng}</p>
        </div>
      </div>
    </div>
  );
}

export default WidgetCircular;
