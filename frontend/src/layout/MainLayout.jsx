// src/layout/MainLayout.jsx
//
// MainLayout ist das Grundgerüst deiner App:
// - Links: Sidebar (immer sichtbar)
// - Rechts: Content-Bereich, in den React Router die Seiten rendert
//
// Wichtig:
// - <Outlet /> wird durch die jeweilige Route ersetzt (z. B. Dashboard)
// - Sidebar bekommt hier die Callback-Funktionen (z. B. onShowE)
//   und reicht sie an Dashboard weiter
//

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Dashboard-Logik (dynamische Container) wird hier verwaltet
import { useState } from "react";

export default function MainLayout() {
  // State für dynamische Container im Dashboard
  const [showE, setShowE] = useState(false);

  return (
    <div style={{ display: "flex" }}>

      {/* Sidebar links – bekommt Callback-Funktionen */}
      <Sidebar
        onShowE={() => setShowE(true)}   // Sidebar kann Container E einblenden
      />

      {/* Content-Bereich rechts */}
      <div
        style={{
          marginLeft: "250px",   // Platz für Sidebar
          padding: "1rem",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa"
        }}
      >
        {/* 
          Outlet = Platzhalter für die aktuelle Route.
          Beispiel:
          - "/" lädt Dashboard.jsx
          - "/settings" lädt SettingsPage.jsx
        */}
        <Outlet context={{ showE, setShowE }} />
      </div>
    </div>
  );
}
