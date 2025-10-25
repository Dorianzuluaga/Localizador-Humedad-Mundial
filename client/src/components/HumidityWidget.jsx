import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as htl from "htl";

// Widget para mostrar la humedad en formato de barra horizontal
// Utiliza D3.js para crear un gráfico de barras con un gradiente de color
// El gradiente va de púrpura a rojo y luego a dorado, representando
function HumidityWidget({ humidity }) {
  const ref = useRef();

  useEffect(() => {
    const percent = Math.max(0, Math.min(100, humidity));
    ref.current.innerHTML = "";

    const data = [{ name: "Humedad", value: percent }];

    const chart = Plot.plot({
      width: 300,
      height: 80,
      marginTop: 10,
      marginBottom: 30,
      x: {
        domain: [0, 100],
        label: null,
        tickFormat: () => "",
      },
      y: {
        label: null,
        tickFormat: () => "",
      },
      marks: [
        // Definimos el gradiente SVG
        () => htl.svg`<defs>
          <linearGradient id="humidity-gradient" gradientTransform="rotate(90)">
            <stop offset="15%" stop-color="purple" />
            <stop offset="75%" stop-color="red" />
            <stop offset="100%" stop-color="gold" />
          </linearGradient>
        </defs>`,
        // Barra con relleno del gradiente
        Plot.barX(data, {
          x: "value",
          y: "name",
          fill: "url(#humidity-gradient)",
          rx: 6,
        }),
        // Texto dentro de la barra
        Plot.text(data, {
          x: "value",
          y: "name",
          text: (d) => `${d.value}%`,
          dx: -30,
          fill: "white",
          fontWeight: "bold",
          textAnchor: "end",
        }),
      ],
    });

    ref.current.appendChild(chart);
    return () => chart.remove();
  }, [humidity]);

  return <div ref={ref}></div>;
}

export default HumidityWidget;
