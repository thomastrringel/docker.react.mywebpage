// src/components/ServerStatus.jsx
//
// -------------------------------------------------------------
// ServerStatus-Komponente
// -------------------------------------------------------------
// - Zeigt Statusfelder für:
//   CURL, PHP, HTTPS, FastAPI Astro, FastAPI Finance, Debug
// - Zusätzlich: IP-Konfiguration aus Finance API
// - Farb-Logik:
//      "unchecked" → GELB
//      "error"     → ROT
//      sonst       → GRÜN
// -------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { FINANCEAPI_URL } from "../config/apiConfig";
import { ASTROAPI_URL } from "../config/apiConfig";

// -------------------------------------------------------------
// 1) Dummy-Statusobjekt (initialer Zustand)
// -------------------------------------------------------------
const initialStatus = {
  curl: "unchecked",
  php: "unchecked",
  https: "unchecked",
  fastapiAstro: "unchecked",
  fastapiFinance: "unchecked",
  debug: "unchecked",
};

// -------------------------------------------------------------
// 2) Hilfsfunktion: rendert eine einzelne Statusbox
// -------------------------------------------------------------
function StatusBox({ label, value }) {
  let bgColor = "#fff9c4"; // GELB (unchecked)

  if (value === "error") {
    bgColor = "#ffcccc"; // ROT
  } else if (value !== "unchecked") {
    bgColor = "#ccffcc"; // GRÜN
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        margin: "0.5rem",
        minWidth: "200px",
        backgroundColor: bgColor,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        flex: "1 1 200px",
      }}
    >
      <strong>{label}</strong>
      <div style={{ marginTop: "0.5rem", fontSize: "1.1rem", color: "#333" }}>
        {value}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3) Hauptkomponente
// -------------------------------------------------------------
export default function ServerStatus() {
  const [status, setStatus] = useState(initialStatus);

  const [ipConfig, setIpConfig] = useState({
    container_hostname: "unchecked",
    container_ip: "unchecked",
    host_laptop_ip: "unchecked",
  });

  // -----------------------------------------------------------
  // 4) CURL prüfen
  // -----------------------------------------------------------
  async function checkCURL() {
    try {
      console.log("(ServerStatus) Prüfe CURL...");

      // Test-URL – später anpassbar
      const url = `${FINANCEAPI_URL}/curltest.php`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("CURL antwortet nicht");

      const text = await response.text();
      console.log("(ServerStatus) CURL:", text);

      const ok = text.toLowerCase().includes("ok");

      setStatus((prev) => ({
        ...prev,
        curl: ok ? text : "error",
      }));
    } catch (err) {
      console.error("(ServerStatus) CURL Fehler:", err);
      setStatus((prev) => ({
        ...prev,
        curl: "error",
      }));
    }
  }

  // -----------------------------------------------------------
  // 5) PHP-Version prüfen
  // -----------------------------------------------------------
  async function checkPHP() {
    try {
      console.log("(ServerStatus) Prüfe PHP-Version...");

      const url = `${FINANCEAPI_URL}/phpversion.php`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("PHP antwortet nicht");

      const text = await response.text();
      console.log("(ServerStatus) PHP-Version:", text);

      const ok = text.toLowerCase().includes("php");

      setStatus((prev) => ({
        ...prev,
        php: ok ? text : "error",
      }));
    } catch (err) {
      console.error("(ServerStatus) PHP Fehler:", err);
      setStatus((prev) => ({
        ...prev,
        php: "error",
      }));
    }
  }

  // -----------------------------------------------------------
  // 6) HTTPS prüfen
  // -----------------------------------------------------------
  async function checkHTTPS() {
    try {
      console.log("(ServerStatus) Prüfe HTTPS...");

      const url = `${FINANCEAPI_URL}`;
      const response = await fetch(url, { method: "GET" });

      if (response.ok) {
        setStatus((prev) => ({
          ...prev,
          https: "ok",
        }));
      } else {
        throw new Error("HTTPS antwortet nicht");
      }
    } catch (err) {
      console.error("(ServerStatus) HTTPS Fehler:", err);

      setStatus((prev) => ({
        ...prev,
        https: "error",
      }));
    }
  }

  // -----------------------------------------------------------
  // 7) FastAPI Astro prüfen (Port 8001)
  // -----------------------------------------------------------
  async function checkFastApiAstro() {
    try {
      console.log("(ServerStatus) Prüfe FastAPI Astro...");

      const url = `${ASTROAPI_URL}/checkfastapi`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Astro antwortet nicht");

      const text = await response.text();
      console.log("(ServerStatus) Astro:", text);

      const ok = text.includes("läuft");

      setStatus((prev) => ({
        ...prev,
        fastapiAstro: ok ? "ok" : "error",
      }));
    } catch (err) {
      console.error("(ServerStatus) Astro Fehler:", err);
      setStatus((prev) => ({
        ...prev,
        fastapiAstro: "error",
      }));
    }
  }

  // -----------------------------------------------------------
  // 8) FastAPI Finance prüfen (Port 8002)
  // -----------------------------------------------------------
  async function checkFastApiFinance() {
    try {
      console.log("(ServerStatus) Prüfe FastAPI Finance...");

      const url = `${FINANCEAPI_URL}/checkfastapi`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Finance antwortet nicht");

      const text = await response.text();
      console.log("(ServerStatus) Finance:", text);

      const ok = text.includes("läuft");

      setStatus((prev) => ({
        ...prev,
        fastapiFinance: ok ? "ok" : "error",
      }));
    } catch (err) {
      console.error("(ServerStatus) Finance Fehler:", err);
      setStatus((prev) => ({
        ...prev,
        fastapiFinance: "error",
      }));
    }
  }

  // -----------------------------------------------------------
  // 9) IP-Konfiguration laden (Finance API → Port 8002)
  // -----------------------------------------------------------
  async function loadIpConfig() {
    try {
      console.log("(ServerStatus) Lade IP-Konfiguration...");

      const url = `${FINANCEAPI_URL}/getipconfig`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Fehlerhafte Antwort");

      const data = await response.json();
      console.log("(ServerStatus) IP-Daten:", data);

      setIpConfig({
        container_hostname: data.container_hostname,
        container_ip: data.container_ip,
        host_laptop_ip: data.host_laptop_ip,
      });
    } catch (err) {
      console.error("(ServerStatus) Fehler beim Laden der IP-Daten:", err);

      setIpConfig({
        container_hostname: "error",
        container_ip: "error",
        host_laptop_ip: "error",
      });
    }
  }

  // -----------------------------------------------------------
  // 10) Beim Laden der Seite Checks ausführen
  // -----------------------------------------------------------
  useEffect(() => {
    checkCURL();          // <--- NEU
    checkPHP();
    checkHTTPS();
    checkFastApiAstro();
    checkFastApiFinance();
    loadIpConfig();
  }, []);

  // -----------------------------------------------------------
  // 11) Rendering
  // -----------------------------------------------------------
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Server Status</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <StatusBox label="CURL" value={status.curl} />
        <StatusBox label="PHP" value={status.php} />
        <StatusBox label="HTTPS" value={status.https} />

        <StatusBox label="FastAPI Astro" value={status.fastapiAstro} />
        <StatusBox label="FastAPI Finance" value={status.fastapiFinance} />

        <StatusBox label="Debug" value={status.debug} />

        <StatusBox label="Container Hostname" value={ipConfig.container_hostname} />
        <StatusBox label="Container IP" value={ipConfig.container_ip} />
        <StatusBox label="Host Laptop IP" value={ipConfig.host_laptop_ip} />
      </div>
    </div>
  );
}
