// src/containers/ContainerA.jsx
// -------------------------------------------------------------
// Container A (UI-only)
// -------------------------------------------------------------
// - Zeigt Tickerliste an
// - Navigation über "<--" und "-->"
// - Add/Remove über Dialoge
// - KEINE eigene Datenlogik mehr
// - Alle Aktionen gehen nach oben an FinanceDashboard
// -------------------------------------------------------------

import { useState } from "react";

export default function ContainerA({
  tickers,
  selectedIndex,
  onSelectIndex,
  onAddTicker,
  onRemoveTicker,
  onReloadTickers
}) {
  // Dialog-States
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTicker, setNewTicker] = useState("");

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // -----------------------------------------------------------
  // Navigation
  // -----------------------------------------------------------
  function handlePrevious() {
    if (selectedIndex <= 0) {
      alert("Erster Eintrag ist bereits ausgewählt.");
      return;
    }
    onSelectIndex(selectedIndex - 1);
  }

  function handleNext() {
    if (selectedIndex >= tickers.length - 1) {
      alert("Letzter Eintrag ist bereits ausgewählt.");
      return;
    }
    onSelectIndex(selectedIndex + 1);
  }

  // -----------------------------------------------------------
  // Add Symbol
  // -----------------------------------------------------------
  function handleAdd() {
    const symbol = newTicker.trim().toUpperCase();
    if (!symbol) {
      alert("Bitte ein Symbol eingeben.");
      return;
    }

    onAddTicker(symbol);
    setShowAddDialog(false);
    setNewTicker("");
  }

  // -----------------------------------------------------------
  // Remove Symbol
  // -----------------------------------------------------------
  function handleRemove() {
    if (selectedIndex < 0) {
      alert("Bitte zuerst einen Ticker auswählen.");
      return;
    }

    const symbol = tickers[selectedIndex].symbol;
    onRemoveTicker(symbol);
    setShowRemoveDialog(false);
  }

  // -----------------------------------------------------------
  // Button-Styling
  // -----------------------------------------------------------
  const navButtonStyle = {
    padding: "4px 10px",
    fontSize: "0.9rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const actionButtonStyle = {
    padding: "6px 14px",
    fontSize: "0.9rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const removeButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#dc3545",
  };

  // -----------------------------------------------------------
  // JSX Rendering
  // -----------------------------------------------------------
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>(A) Symbols loaded from database</h3>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          style={navButtonStyle}
          onClick={handlePrevious}
          title="Vorheriges Symbol auswählen"
        >
          &lt;--
        </button>

        <select
          id="A_sel_StockNamesList"
          value={selectedIndex >= 0 ? tickers[selectedIndex]?.symbol : ""}
          onChange={(e) => {
            const value = e.target.value;
            const index = tickers.findIndex((t) => t.symbol === value);
            onSelectIndex(index);
          }}
          style={{ padding: "6px", fontSize: "1rem" }}
        >
          <option value="">Bitte wählen…</option>
          {tickers.map((item) => (
            <option key={item.symbol} value={item.symbol}>
              {item.symbol}
            </option>
          ))}
        </select>

        <button
          style={navButtonStyle}
          onClick={handleNext}
          title="Nächstes Symbol auswählen"
        >
          --&gt;
        </button>
      </div>

      {/* Add / Remove */}
      <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
        <button style={actionButtonStyle} onClick={() => setShowAddDialog(true)}>
          Add
        </button>

        <button
          style={removeButtonStyle}
          onClick={() => setShowRemoveDialog(true)}
          disabled={selectedIndex < 0}
        >
          Remove
        </button>
      </div>

      {/* -----------------------------------------------------------
          ADD MODAL
         ----------------------------------------------------------- */}
      {showAddDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              minWidth: "300px",
            }}
          >
            <h4 style={{ marginBottom: "1rem" }}>Add Ticker Symbol</h4>

            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="z.B. AAPL"
              style={{ padding: "6px", width: "100%" }}
            />

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button style={actionButtonStyle} onClick={handleAdd}>
                Save
              </button>

              <button
                style={removeButtonStyle}
                onClick={() => {
                  setShowAddDialog(false);
                  setNewTicker("");
                }}
              >
                Abbruch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
          REMOVE MODAL
         ----------------------------------------------------------- */}
      {showRemoveDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#f8d7da",
              padding: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              minWidth: "300px",
            }}
          >
            <h4 style={{ marginBottom: "1rem" }}>
              Soll der Ticker wirklich gelöscht werden?
            </h4>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button style={removeButtonStyle} onClick={handleRemove}>
                JA
              </button>

              <button
                style={navButtonStyle}
                onClick={() => setShowRemoveDialog(false)}
              >
                Abbruch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
