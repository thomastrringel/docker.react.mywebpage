// src/App.jsx
//
// Diese Version verbindet:
// - React Router (für echte Seiten / Navigation)
// - ein dynamisches Dashboard (Container A + E wachsen untereinander)
// - ein MainLayout, das Sidebar + Content-Bereich kapselt
//
// Wichtig:
// Dashboard.jsx übernimmt die dynamische Logik (showE usw.)
// Sidebar ruft onShowE() auf, das vom Dashboard kommt
//

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout mit Sidebar links und Content rechts
import MainLayout from "./layout/MainLayout";

// Dashboard (dynamisch wachsend)
import Dashboard from "./pages/Dashboard";

// Beispiel für spätere echte Seiten
// import SettingsPage from "./pages/SettingsPage";
// import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MainLayout enthält Sidebar + Outlet */}
        <Route path="/" element={<MainLayout />}>

          {/* Dashboard ist die Startseite */}
          <Route index element={<Dashboard />} />

          {/* Beispiel für spätere echte Router-Seiten */}
          {/* <Route path="settings" element={<SettingsPage />} /> */}
          {/* <Route path="about" element={<AboutPage />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
