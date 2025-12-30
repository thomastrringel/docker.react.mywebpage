// src/pages/Dashboard.jsx

/*
  Dashboard.jsx ist die dynamische Hauptseite deines Systems.

  WICHTIG:
  - Der State (showE, setShowE) kommt NICHT mehr aus Dashboard selbst.
  - Stattdessen liefert MainLayout diesen State über <Outlet context={...} />.
  - Dashboard liest diesen State über useOutletContext().

  Vorteile:
  - Sidebar kann Container E einblenden (über MainLayout).
  - Dashboard bleibt "dumm" und zeigt nur an, was MainLayout vorgibt.
  - Perfekt für dein wachsendes Dashboard-Konzept.
*/

import { useOutletContext } from "react-router-dom";

// Deine Container
import ContainerA from "../containers/ContainerA";
import ContainerE from "../containers/ContainerE";

export default function Dashboard() {
  /*
    useOutletContext() holt den State aus MainLayout.

    MainLayout liefert:
      { showE, setShowE }

    Dadurch kann Dashboard:
    - showE lesen
    - setShowE(true) oder setShowE(false) ausführen (falls nötig)
  */
  const { showE, setShowE } = useOutletContext();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>

      {/* Container A ist immer sichtbar */}
      <ContainerA />

      {/* Container E wird dynamisch eingeblendet */}
      {showE && <ContainerE />}

      {/* Debug-Buttons (optional) – kannst du später löschen */}
      <div style={{ marginTop: "2rem", opacity: 0.5 }}>
        <button onClick={() => setShowE(true)}>Show E (Debug)</button>
        <button onClick={() => setShowE(false)}>Hide E (Debug)</button>
      </div>
    </div>
  );
}
