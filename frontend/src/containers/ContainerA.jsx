// src/containers/ContainerA.jsx
//
// React-Version von Container A
// - Lädt Ticker aus FastAPI
// - Rendert Dropdown
// - Meldet Auswahl an Dashboard/MainLayout zurück
//

import { useEffect, useState } from "react";

export default function ContainerA({ onSelectTicker }) {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);

  // FastAPI URL – später aus config laden
  const FASTAPI_URL = "http://localhost:8002";

  // Lädt die Tickerliste beim ersten Rendern
  useEffect(() => {
    async function loadTickers() {
      setLoading(true);

      try {
        console.log("(A-01) Fetching tickers from FastAPI");

        const sql = "SELECT * FROM SYMBOLS ORDER BY symbol ASC";
        const url = `${FASTAPI_URL}/readsql?query=${sql}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Serverantwort war nicht OK: " + response.status);
        }

        const data = await response.json();
        console.log("(A-02) Daten geladen:", data);

        setTickers(data);
      } catch (err) {
        console.error("(A-03) Fehler beim Laden:", err);
      }

      setLoading(false);
    }

    loadTickers();
  }, []);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>(A) Symbols loaded from database</h3>

      {loading && <p>Lade Daten…</p>}

      {!loading && (
        <select
          id="A_sel_StockNamesList"
          onChange={(e) => {
            const value = e.target.value;
            console.log("(A-04) Auswahl geändert:", value);
            onSelectTicker(value); // an Dashboard/MainLayout melden
          }}
        >
          <option value="">Bitte wählen…</option>

          {tickers.map((item) => (
            <option key={item.symbol} value={item.symbol}>
              {item.symbol}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
