// src/components/FinanceDashboard.jsx
// --------------------------------------------------------------
// FinanceDashboard (UI-Orchestrator)
// --------------------------------------------------------------
// Diese Komponente enthält KEINE eigene Logik und KEINEN eigenen State.
// Alle Daten und Funktionen kommen aus MainLayout über useOutletContext().
//
// Aufgaben:
//   • ContainerA anzeigen (Tickerliste + Navigation)
//   • ContainerE anzeigen (Ticker-Details)
//   • ContainerF anzeigen (Fortune over time)
//
// MainLayout hält ALLE Finance-Daten persistent:
//   - tickers
//   - selectedIndex
//   - selectedTicker
//   - quoteData
//   - plotHtml
//   - loadingQuote
//   - showE / showFortuneOverTime
//
// Dadurch gehen beim Navigieren KEINE Daten mehr verloren.
// --------------------------------------------------------------

import { useOutletContext } from "react-router-dom";

import ContainerA from "../containers/ContainerA";
import ContainerE from "../containers/ContainerE";
import ContainerF from "../containers/ContainerF";

export default function FinanceDashboard() {
  // ------------------------------------------------------------
  // Alle Finance-Daten und Funktionen aus MainLayout abrufen
  // ------------------------------------------------------------
  const {
    // Sichtbarkeit
    showE,
    setShowE,
    showFortuneOverTime,

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
  } = useOutletContext();

  // ------------------------------------------------------------
  // Auswahl eines Tickers (Index)
  // ------------------------------------------------------------
  function handleSelectIndex(index) {
    if (index < 0 || index >= tickers.length) return;

    setSelectedIndex(index);
    setSelectedTicker(tickers[index].symbol);
    setShowE(true); // Container E automatisch öffnen
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Finance Dashboard</h1>

      {/* --------------------------------------------------------
         Container A (Tickerliste + Navigation)
         --------------------------------------------------------- */}
      <ContainerA
        tickers={tickers}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
        onAddTicker={addTicker}
        onRemoveTicker={removeTicker}
        onReloadTickers={loadTickers}
      />

      {/* --------------------------------------------------------
         Container E (Ticker-Details)
         --------------------------------------------------------- */}
      {showE && (
        <div style={{ marginTop: "1.5rem" }}>
          <ContainerE
            symbol={selectedTicker}
            quoteData={quoteData}
            plotHtml={plotHtml}
            loading={loadingQuote}
            onFetchQuote={fetchQuote}
          />
        </div>
      )}

      {/* --------------------------------------------------------
         Container F (Fortune over time)
         --------------------------------------------------------- */}
      {showFortuneOverTime && (
        <div style={{ marginTop: "1.5rem" }}>
          <ContainerF />
        </div>
      )}
    </div>
  );
}
