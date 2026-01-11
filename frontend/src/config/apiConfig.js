/* eslint-disable no-unused-vars */
// src/config/apiConfig.js
//
// Zentrale Konfiguration für API-URLs.
// Idee:
// - Basis-URL für FastAPI wird über Umgebungsvariablen gesteuert.
// - Optional kann HOSTSYSTEM (LAP / NAS) genutzt werden, um Defaults zu setzen.

/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/

const HOSTSYSTEM = import.meta.env.VITE_HOSTSYSTEM || "LAPTOP"; 
// oder bei CRA: process.env.REACT_APP_HOSTSYSTEM

const DEFAULTFINANCEAPI = "http://localhost:8002";
const DEFAULTASTROAPI = "http://localhost:8001";

function getDefaultFinanceApiUrl() {
  if (HOSTSYSTEM === "NAS") {
    // Platzhalter: später z. B. http://nas.local:8002 oder http://192.168.1.50:8002
    return "http://NAS_IP_ODER_HOST:8002";
  }

  // Standard: Laptop
  // Wichtig: localhost ist nur für Tests am gleichen Gerät geeignet.
  return "http://localhost:8002";
}

function getDefaultAstroApiUrl() {
  if (HOSTSYSTEM === "NAS") {
    // Platzhalter: später z. B. http://nas.local:8002 oder http://192.168.1.50:8002
    return "http://NAS_IP_ODER_HOST:8001";
  }

  // Standard: Laptop
  // Wichtig: localhost ist nur für Tests am gleichen Gerät geeignet.
  return "http://localhost:8001";
}

function getFinanceApiUrl() {
  return FINANCEAPI_URL;

}

export const MYHOSTSYSTEM = HOSTSYSTEM;

export const HOST_IP = import.meta.env.VITE_HOST_IP || "localhost";

export const FINANCEAPI_URL =
  import.meta.env.VITE_FINANCEAPI_URL || DEFAULTFINANCEAPI;

export const ASTROAPI_URL =
  import.meta.env.VITE_ASTROAPI_URL || DEFAULTASTROAPI;
// bei CRA: process.env.REACT_APP_FASTAPI_URL || getDefaultFastApiUrl();
