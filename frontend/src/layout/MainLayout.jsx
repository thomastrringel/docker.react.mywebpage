// src/layout/MainLayout.jsx
// --------------------------------------------------------------
// MainLayout ist das Grundgerüst deiner App:
//
// - Links: Sidebar (immer sichtbar)
// - Rechts: Content-Bereich, in den React Router die Seiten rendert
//
// NEUE ARCHITEKTUR (persistent):
// --------------------------------------------------------------
// Jeder Bereich (Finance, Astronomy, System) soll seinen Zustand
// behalten, auch wenn der Benutzer zu einem anderen Bereich navigiert.
//
// Deshalb liegt der gesamte Finance-State HIER im MainLayout,
// denn nur MainLayout bleibt beim Navigieren erhalten.
// --------------------------------------------------------------

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  FINANCEAPI_URL,
  ASTROAPI_URL,
  MYHOSTSYSTEM,
  HOST_IP,
} from "../config/apiConfig.js";

export default function MainLayout() {
  // ---------------------------------------------------------------
  // Debug-Ausgaben (optional)
  // ---------------------------------------------------------------
  console.log("(MainLayout) Rendering MainLayout");
  console.log("(MainLayout) MYHOSTSYSTEM =", MYHOSTSYSTEM);
  console.log("(MainLayout) HOST_IP =", HOST_IP);
  console.log("(MainLayout) FINANCEAPI_URL =", FINANCEAPI_URL);
  console.log("(MainLayout) AstroAPI_URL =", ASTROAPI_URL);

  // ---------------------------------------------------------------
  // PERSISTENTER STATE: Finance-Bereich
  // ---------------------------------------------------------------
  // Diese States bleiben erhalten, solange die App läuft.
  // ---------------------------------------------------------------

  // Sichtbarkeit der Container
  const [showE, setShowE] = useState(false);
  const [showFortuneOverTime, setShowFortuneOverTime] = useState(false);

  // Auswahl
  const [selectedTicker, setSelectedTicker] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Tickerliste
  const [tickers, setTickers] = useState([]);

  // Quote-Daten (Container E)
  const [quoteData, setQuoteData] = useState(null);
  const [plotHtml, setPlotHtml] = useState("");
  const [loadingQuote, setLoadingQuote] = useState(false);

  // ---------------------------------------------------------------
  // FINANCE: Funktionen
  // ---------------------------------------------------------------

  // 1) Tickerliste laden
  async function loadTickers() {
    try {
      const sql = "SELECT * FROM SYMBOLS ORDER BY symbol ASC";
      const url = `${FINANCEAPI_URL}/readsql?query=${sql}`;
      const response = await fetch(url);
      const data = await response.json();
      setTickers(data);
    } catch (err) {
      console.error("Fehler beim Laden der Ticker:", err);
    }
  }

  // Beim Start einmal laden
  useEffect(() => {
    loadTickers();
  }, []);

  // 2) Ticker hinzufügen
  async function addTicker(symbol) {
    try {
      const url = `${FINANCEAPI_URL}/addSymbol?symbol=${symbol}`;
      await fetch(url);
      await loadTickers();
    } catch (err) {
      console.error("Fehler beim Hinzufügen:", err);
    }
  }

  // 3) Ticker löschen
  async function removeTicker(symbol) {
    try {
      const url = `${FINANCEAPI_URL}/removeSymbol?symbol=${symbol}`;
      await fetch(url);
      await loadTickers();

      // Auswahl zurücksetzen
      setSelectedIndex(-1);
      setSelectedTicker("");

      // Quote-Daten löschen
      setQuoteData(null);
      setPlotHtml("");
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
    }
  }

  // 4) Quote laden (zentral)
  async function fetchQuote(symbol) {
    const s = symbol.trim().toUpperCase();
    if (!s) return;

    setLoadingQuote(true);
    setQuoteData(null);
    setPlotHtml("");

    try {
      // Quote laden
      const url = `${FINANCEAPI_URL}/yfinance/stock/${s}`;
      const response = await fetch(url);
      const json = await response.json();
      setQuoteData(json);

      // Plot laden
      const min = json.fiftyTwoWeekLow ?? 0;
      const max = json.fiftyTwoWeekHigh ?? 100;
      const today = json.regularMarketPrice ?? 50;
      const reference = json.previousClose ?? today;
      const redline =
        json.twoHundredDayAverage !== "N/A"
          ? json.twoHundredDayAverage
          : today;

      const plotUrl =
        `${FINANCEAPI_URL}/getPlotlyhtml?symbol=${s}` +
        `&min=${min}&max=${max}&today=${today}` +
        `&reference=${reference}&redline=${redline}`;

      const plotResponse = await fetch(plotUrl);
      const html = await plotResponse.text();
      setPlotHtml(html);
    } catch (err) {
      console.error("Fehler beim Laden der Quote:", err);
      setQuoteData({ error: err.message });
    }

    setLoadingQuote(false);
  }

  // ---------------------------------------------------------------
  // RENDER: Sidebar + Content-Bereich
  // ---------------------------------------------------------------
  return (
    <div style={{ display: "flex" }}>
      {/* -----------------------------------------------------------
         Sidebar (linker Bereich)
         ----------------------------------------------------------- */}
      <Sidebar
        onShowE={() => {
          console.log("Sidebar → showE = true");
          setShowE(true);
        }}
        onShowFortuneOverTime={() => {
          console.log("Sidebar → showFortuneOverTime = true");
          setShowFortuneOverTime(true);
          setShowE(true); // Reihenfolge A → E → F
        }}
      />

      {/* -----------------------------------------------------------
         Content-Bereich (rechter Bereich)
         ----------------------------------------------------------- */}
      <div
        style={{
          marginLeft: "250px",
          padding: "1rem",
          width: "calc(100vw - 250px)",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Outlet
          context={{
            // Sichtbarkeit
            showE,
            setShowE,
            showFortuneOverTime,
            setShowFortuneOverTime,

            // Auswahl
            selectedTicker,
            setSelectedTicker,
            selectedIndex,
            setSelectedIndex,

            // Tickerliste
            tickers,
            loadTickers,
            addTicker,
            removeTicker,

            // Quote-Daten
            quoteData,
            plotHtml,
            loadingQuote,
            fetchQuote,
          }}
        />
      </div>
    </div>
  );
}
