// src/App.jsx
// --------------------------------------------------------------
// App.jsx
// --------------------------------------------------------------
// Diese Datei definiert die gesamte Routing-Struktur der Anwendung.
//
// Neue Architektur (10.01.2026):
//   "/"           → WelcomePage (neutrale Begrüßungsseite)
//   "/finance"    → FinanceDashboard (Container A/E/F)
//   "/astronomy"  → AstronomyDashboard
//   "/system"     → SystemDashboard (ehemals ServerStatus)
//
// MainLayout kapselt Sidebar + Content-Bereich.
// Alle Seiten werden im <Outlet /> von MainLayout gerendert.
// --------------------------------------------------------------

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layout/MainLayout";

// Neue Seiten
import WelcomePage from "./components/WelcomePage";
import FinanceDashboard from "./components/FinanceDashboard";
import AstronomyDashboard from "./components/AstronomyDashboard";
import SystemDashboard from "./components/SystemDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --------------------------------------------------------
           MainLayout enthält Sidebar + Outlet
           -------------------------------------------------------- */}
        <Route path="/" element={<MainLayout />}>

          {/* ------------------------------------------------------
             1) Begrüßungsseite (Startseite)
             ------------------------------------------------------ */}
          <Route index element={<WelcomePage />} />

          {/* ------------------------------------------------------
             2) Finanzbereich
             ------------------------------------------------------ */}
          <Route path="finance" element={<FinanceDashboard />} />

          {/* ------------------------------------------------------
             3) Astronomie-Bereich
             ------------------------------------------------------ */}
          <Route path="astronomy" element={<AstronomyDashboard />} />

          {/* ------------------------------------------------------
             4) System-Bereich
             ------------------------------------------------------ */}
          <Route path="system" element={<SystemDashboard />} />

          {/* ------------------------------------------------------
             Optional: Einzelroute für CheckServer
             (falls du sie separat behalten willst)
             ------------------------------------------------------ */}
          {/* <Route path="checkserver" element={<SystemDashboard />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
