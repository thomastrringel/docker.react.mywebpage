import { useState, useEffect } from "react";
import '../assets/css/myCSS.css';

export default function ContainerE({ ticker }) {
  const [symbol, setSymbol] = useState(ticker || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plotHtml, setPlotHtml] = useState("");
  
  const FASTAPI_URL = "http://localhost:8002";
  
  useEffect(() => {
    if (ticker) {
      setSymbol(ticker);
    }
  }, [ticker]);



  // ---------------------------------------------------------
  // 1) Quote laden + Plotly-Parameter berechnen
  // ---------------------------------------------------------
  async function fetchQuote() {
    const currentSymbol = symbol.trim().toUpperCase();
    if (!currentSymbol) return;

    setLoading(true);
    setData(null);
    setPlotHtml("");

    try {
      const url = `${FASTAPI_URL}/yfinance/stock/${currentSymbol}`;
      console.log("Fetching:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Server returned " + response.status);

      const json = await response.json();
      console.log("Received:", json);

      setData(json);

      // ---------------------------------------------------------
      // Plotly-Parameter aus API-Daten berechnen (wie früher!)
      // ---------------------------------------------------------
      const min = json.fiftyTwoWeekLow ?? 0;
      const max = json.fiftyTwoWeekHigh ?? 100;
      const today = json.regularMarketPrice ?? 50;
      const reference = json.previousClose ?? today;
      const redline =
        json.twoHundredDayAverage !== "N/A"
          ? json.twoHundredDayAverage
          : today;

      console.log(
        `Plotly params: symbol=${currentSymbol}, min=${min}, max=${max}, today=${today}, reference=${reference}, redline=${redline}`
      );

      // Jetzt Plotly laden
      fetchPlotly(currentSymbol, min, max, today, reference, redline);

    } catch (err) {
      console.error("Error fetching quote:", err);
      setData({ error: err.message });
    }

    setLoading(false);
  }

  // ---------------------------------------------------------
  // 2) Plotly laden (mit allen Parametern!)
  // ---------------------------------------------------------
  async function fetchPlotly(symbol, min, max, today, reference, redline) {
    try {
      const url =
        `${FASTAPI_URL}/getPlotlyhtml?symbol=${symbol}` +
        `&min=${min}&max=${max}&today=${today}` +
        `&reference=${reference}&redline=${redline}`;

      console.log("Fetching Plotly:", url);

      const response = await fetch(url);
      const html = await response.text();

      setPlotHtml(html);
    } catch (err) {
      console.error("Plotly error:", err);
      setPlotHtml("<p style='color:red'>Fehler beim Laden der Grafik</p>");
    }
  }

  // ---------------------------------------------------------
  // JSX Rendering
  // ---------------------------------------------------------
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center" }}>(E) Symbols from yFinance</h3>

      {/* Eingabe + Button */}
      <div className="row" style={{ marginBottom: "1rem" }}>
        <div className="col">
          <p>yFinance symbol</p>

          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="form-control"
          />

          <button className="btn btn-primary mt-2" onClick={fetchQuote}>
            get Quote
          </button>
        </div>
      </div>

      {loading && <p>Lade Daten…</p>}

      {data?.error && <p style={{ color: "red" }}>Fehler: {data.error}</p>}

      {/* Datenanzeige */}
      {data && !data.error && (
        <div className="container">
          <div className="row">
            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>displayName</p>
              <p className="yFinance-data-value">{data.name}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>currentPrice</p>
              <p className="yFinance-data-value">{data.regularMarketPrice}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>Currency</p>
              <p className="yFinance-data-value">{data.currency}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>priceToBook</p>
              <p className="yFinance-data-value">{data.priceToBook}</p>
            </div>
          </div>

          <div className="row" style={{ marginTop: "1rem" }}>
            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyTwoWeekLow</p>
              <p className="yFinance-data-value">{data.fiftyTwoWeekLow}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyTwoWeekHigh</p>
              <p className="yFinance-data-value">{data.fiftyTwoWeekHigh}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>fiftyDayAverage</p>
              <p className="yFinance-data-value">{data.fiftyDayAverage}</p>
            </div>

            <div className="col yFinance-data-frame">
              <p style={{ textAlign: "center" }}>twoHundredDayAverage</p>
              <p className="yFinance-data-value">{data.twoHundredDayAverage}</p>
            </div>
          </div>

          {/* Plotly Grafik */}
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
