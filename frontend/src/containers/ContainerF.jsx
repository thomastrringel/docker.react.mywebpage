// src/containers/ContainerF.jsx
//
// -------------------------------------------------------------
// ContainerF – "Fortune over time"
// -------------------------------------------------------------
// Zeigt zwei Plotly-Diagramme:
// 1) Zeitverlauf von Ausgaben und Einnahmen
// 2) Weekly Change mit drei Indikatoren
//
// Besonderheiten:
// - Lädt Daten von FastAPI (/getInvest)
// - Nutzt Plotly für Visualisierung
// - Passt sich responsiv an die Bildschirmbreite an
// - Schriftgrößen und Layout optimiert für harmonische Darstellung
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import Plotly from "plotly.js-dist-min";
import { FINANCEAPI_URL } from "../config/apiConfig";


export default function ContainerF() {
  const [investData, setInvestData] = useState(null);
  const FASTAPI_URL = FINANCEAPI_URL;

  // ---------------------------------------------------------
  // 1) Daten von FastAPI laden
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const url = `${FASTAPI_URL}/getInvest`;
        const response = await fetch(url);
        const json = await response.json();
        setInvestData(json);
      } catch (err) {
        console.error("Fehler beim Laden von /getInvest:", err);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------------------------
  // 2) Erstes Diagramm: Ausgaben/Einnahmen über Zeit
  // ---------------------------------------------------------
  useEffect(() => {
    if (!investData) return;

    const traceAusgaben = {
      x: investData.x,
      y: investData.a,
      type: "scatter",
      name: "Ausgaben",
    };

    const traceEinnahmen = {
      x: investData.x,
      y: investData.e,
      type: "scatter",
      name: "Einnahmen",
    };

    const layout = {
      title: "Fortune over time",
      margin: { t: 40, b: 40, l: 50, r: 30 },
    };

    Plotly.newPlot("plotlyAusgabenEinnahmen", [traceAusgaben, traceEinnahmen], layout, {
      responsive: true,
    });
  }, [investData]);

  // ---------------------------------------------------------
  // 3) Zweites Diagramm: Weekly Change (Indikatoren)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!investData) return;

    const a = investData.a;
    const e = investData.e;

    if (!Array.isArray(a) || a.length < 2) return;

    const WERT_AUSGABE_LAST = a[a.length - 1];
    const WERT_AUSGABE_PREV = a[a.length - 2];
    const WERT_EINNAHME_LAST = e[e.length - 1];
    const WERT_EINNAHME_PREV = e[e.length - 2];
    const WERT_GuV_LAST = WERT_EINNAHME_LAST - WERT_AUSGABE_LAST;
    const WERT_GuV_PREV = WERT_EINNAHME_PREV - WERT_AUSGABE_PREV;

    const WERT_REL_GuVLAST_AUSGABELAST = (WERT_GuV_LAST / WERT_AUSGABE_LAST) * 100;
    const WERT_REL_GuVPREV_AUSGABEPREV = (WERT_GuV_PREV / WERT_AUSGABE_PREV) * 100;

    const indicatorData = [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        value: WERT_EINNAHME_LAST,
        delta: { reference: WERT_AUSGABE_LAST, font: { size: 12 } },
        domain: { row: 0, column: 0 },
        title: { text: "EINNAHME UND GuV", font: { size: 13 }, align: "center" },
        number: { font: { size: 16 } },
      },
      {
        type: "indicator",
        mode: "number+gauge+delta",
        value: WERT_GuV_LAST,
        delta: { reference: WERT_GuV_PREV, font: { size: 12 } },
        domain: { row: 0, column: 1 },
        title: { text: "GuV UND DELTA", font: { size: 13 }, align: "center" },
        number: { font: { size: 16 } },
      },
      {
        type: "indicator",
        mode: "number+delta",
        value: WERT_REL_GuVLAST_AUSGABELAST,
        number: { suffix: "%", font: { size: 16 } },
        delta: {
          position: "top",
          reference: WERT_REL_GuVPREV_AUSGABEPREV,
          font: { size: 12 },
        },
        domain: { row: 0, column: 2 },
        title: { text: "RELATIVE PERFORMANCE", font: { size: 13 }, align: "center" },
      },
    ];

    const layout = {
      height: 350,
      margin: { t: 25, b: 25, l: 50, r: 50 },
      grid: { rows: 1, columns: 3, pattern: "independent" },
    };

    Plotly.newPlot("plotlyWeeklyChange", indicatorData, layout, { responsive: true });
  }, [investData]);

  // ---------------------------------------------------------
  // JSX Rendering
  // ---------------------------------------------------------
  return (
    <div
      style={{
        marginTop: "2rem",
        width: "100%",           // passt sich dem Container an
        maxWidth: "100%",         // keine Überbreite
        overflowX: "hidden",      // verhindert horizontales Scrollen
      }}
    >
      {/* Titel + Diagramm 1 */}
      <h3>Fortune over time</h3>
      <div
        id="plotlyAusgabenEinnahmen"
        style={{ width: "100%", height: "400px" }}
      ></div>

      {/* Titel + Diagramm 2 */}
      <h3 style={{ marginTop: "2rem" }}>Weekly Change of fortune</h3>
      <div
        id="plotlyWeeklyChange"
        style={{ width: "100%", height: "400px" }}
      ></div>
    </div>
  );
}
