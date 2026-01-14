// src/containers/ContainerE.jsx
// -------------------------------------------------------------
// Container E (UI-only)
// -------------------------------------------------------------
// - Zeigt das yFinance-Symbol an
// - Zeigt Quote-Daten an (über Props)
// - Zeigt Plotly-HTML an (über Props)
// - Ruft fetchQuote über Callback auf
// - KEINE eigene Datenlogik mehr
// -------------------------------------------------------------

import '../assets/css/myCSS.css';

export default function ContainerE({
  symbol,
  quoteData,
  plotHtml,
  loading,
  onFetchQuote
}) {
  // -----------------------------------------------------------
  // JSX Rendering
  // -----------------------------------------------------------
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center" }}>(E) Symbols from yFinance</h3>

      <div className="row" style={{ marginBottom: "1rem" }}>
        <div className="col">
          <p>yFinance symbol</p>

          <input
            type="text"
            value={symbol || ""}
            onChange={(e) => onFetchQuote(e.target.value)}
            className="form-control"
          />

          <button
            className="btn btn-primary mt-2"
            onClick={() => onFetchQuote(symbol)}
          >
            get Quote
          </button>
        </div>
      </div>

      {loading && <p>Lade Daten…</p>}

      {quoteData?.error && (
        <p style={{ color: "red" }}>Fehler: {quoteData.error}</p>
      )}

      {quoteData && !quoteData.error && (
        <div className="container">
          {/* Datenanzeige */}
          <div className="row">
            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>displayName</p>
              <p className="yFinance-data-value">{quoteData.name}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>currentPrice</p>
              <p className="yFinance-data-value">
                {quoteData.regularMarketPrice}
              </p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>Currency</p>
              <p className="yFinance-data-value">{quoteData.currency}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>priceToBook</p>
              <p className="yFinance-data-value">{quoteData.priceToBook}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>forwardPE</p>
              <p className="yFinance-data-value">{quoteData.forwardPE}</p>
            </div>
          </div>

          <div className="row" style={{ marginTop: "1rem" }}>
            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyTwoWeekLow</p>
              <p className="yFinance-data-value">
                {quoteData.fiftyTwoWeekLow}
              </p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyTwoWeekHigh</p>
              <p className="yFinance-data-value">
                {quoteData.fiftyTwoWeekHigh}
              </p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyDayAverage</p>
              <p className="yFinance-data-value">
                {quoteData.fiftyDayAverage}
              </p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>twoHundredDayAverage</p>
              <p className="yFinance-data-value">
                {quoteData.twoHundredDayAverage}
              </p>
            </div>
          </div>

          {plotHtml && (
            <iframe
              title="Plotly Chart"
              srcDoc={plotHtml}
              style={{
                width: "100%",
                height: "300px",
                border: "none",
                marginTop: "20px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
