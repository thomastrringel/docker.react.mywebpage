// src/components/SystemDashboard.jsx
// --------------------------------------------------------------
// SystemDashboard
// --------------------------------------------------------------
// Dies ist die zentrale Seite für den System‑Bereich deiner App.
// Sie wird unter der Route "/system" angezeigt.
//
// Die Seite basiert vollständig auf der bisherigen ServerStatus.jsx,
// wurde aber strukturell und namentlich an die neue Architektur
// (Finance / Astronomy / System) angepasst.
//
// Funktionen:
//   • CURL‑Test
//   • PHP‑Version
//   • HTTPS‑Status
//   • FastAPI Astro Status
//   • FastAPI Finance Status
//   • Debug‑Status (Platzhalter)
//   • IP‑Konfiguration (Container + Host)
//
// Farb‑Logik:
//   "unchecked" → GELB
//   "error"     → ROT
//   sonst       → GRÜN
// --------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { FINANCEAPI_URL } from "../config/apiConfig";
import { ASTROAPI_URL } from "../config/apiConfig";

// -------------------------------------------------------------
// 1) Initialstatus
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
// 2) StatusBox-Komponente
// -------------------------------------------------------------
function StatusBox({ label, value }) {
  let bgColor = "#fff9c4"; // GELB

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
// 3) Hauptkomponente: SystemDashboard
// -------------------------------------------------------------
export default function SystemDashboard() {
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
      console.log("(SystemDashboard) Prüfe CURL...");

      const url = `${FINANCEAPI_URL}/curltest.php`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("CURL antwortet nicht");

      const text = await response.text();
      const ok = text.toLowerCase().includes("ok");

      setStatus((prev) => ({
        ...prev,
        curl: ok ? text : "error",
      }));
    } catch (err) {
      console.error("(SystemDashboard) CURL Fehler:", err);
      setStatus((prev) => ({ ...prev, curl: "error" }));
    }
  }

  // -----------------------------------------------------------
  // 5) PHP-Version prüfen
  // -----------------------------------------------------------
  async function checkPHP() {
    try {
      console.log("(SystemDashboard) Prüfe PHP-Version...");

      const url = `${FINANCEAPI_URL}/phpversion.php`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("PHP antwortet nicht");

      const text = await response.text();
      const ok = text.toLowerCase().includes("php");

      setStatus((prev) => ({
        ...prev,
        php: ok ? text : "error",
      }));
    } catch (err) {
      console.error("(SystemDashboard) PHP Fehler:", err);
      setStatus((prev) => ({ ...prev, php: "error" }));
    }
  }

  // -----------------------------------------------------------
  // 6) HTTPS prüfen
  // -----------------------------------------------------------
  async function checkHTTPS() {
    try {
      console.log("(SystemDashboard) Prüfe HTTPS...");

      const url = `${FINANCEAPI_URL}`;
      const response = await fetch(url, { method: "GET" });

      if (response.ok) {
        setStatus((prev) => ({ ...prev, https: "ok" }));
      } else {
        throw new Error("HTTPS antwortet nicht");
      }
    } catch (err) {
      console.error("(SystemDashboard) HTTPS Fehler:", err);
      setStatus((prev) => ({ ...prev, https: "error" }));
    }
  }

  // -----------------------------------------------------------
  // 7) FastAPI Astro prüfen
  // -----------------------------------------------------------
  async function checkFastApiAstro() {
    try {
      console.log("(SystemDashboard) Prüfe FastAPI Astro...");

      const url = `${ASTROAPI_URL}/checkfastapi`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Astro antwortet nicht");

      const text = await response.text();
      const ok = text.includes("läuft");

      setStatus((prev) => ({
        ...prev,
        fastapiAstro: ok ? "ok" : "error",
      }));
    } catch (err) {
      console.error("(SystemDashboard) Astro Fehler:", err);
      setStatus((prev) => ({ ...prev, fastapiAstro: "error" }));
    }
  }

  // -----------------------------------------------------------
  // 8) FastAPI Finance prüfen
  // -----------------------------------------------------------
  async function checkFastApiFinance() {
    try {
      console.log("(SystemDashboard) Prüfe FastAPI Finance...");

      const url = `${FINANCEAPI_URL}/checkfastapi`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Finance antwortet nicht");

      const text = await response.text();
      const ok = text.includes("läuft");

      setStatus((prev) => ({
        ...prev,
        fastapiFinance: ok ? "ok" : "error",
      }));
    } catch (err) {
      console.error("(SystemDashboard) Finance Fehler:", err);
      setStatus((prev) => ({ ...prev, fastapiFinance: "error" }));
    }
  }

  // -----------------------------------------------------------
  // 9) IP-Konfiguration laden
  // -----------------------------------------------------------
  async function loadIpConfig() {
    try {
      console.log("(SystemDashboard) Lade IP-Konfiguration...");

      const url = `${FINANCEAPI_URL}/getipconfig`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Fehlerhafte Antwort");

      const data = await response.json();

      setIpConfig({
        container_hostname: data.container_hostname,
        container_ip: data.container_ip,
        host_laptop_ip: data.host_laptop_ip,
      });
    } catch (err) {
      console.error("(SystemDashboard) Fehler beim Laden der IP-Daten:", err);

      setIpConfig({
        container_hostname: "error",
        container_ip: "error",
        host_laptop_ip: "error",
      });
    }
  }

  // -----------------------------------------------------------
  // 10) Checks beim Laden der Seite ausführen
  // -----------------------------------------------------------
  useEffect(() => {
    checkCURL();
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
      <h1>System Dashboard</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        Übersicht über Server‑ und API‑Status, Netzwerk‑Konfiguration und technische Tools.
      </p>

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
