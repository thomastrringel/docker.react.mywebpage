// src/components/AstronomyDashboard.jsx
// --------------------------------------------------------------
// AstronomyDashboard
// --------------------------------------------------------------
// Diese Seite ist der zentrale Einstiegspunkt für den Astro‑Bereich.
// Sie wird unter der Route "/astronomy" angezeigt.
//
// Ziel:
//   • Platzhalter für zukünftige Astro‑Container
//   • Saubere Struktur wie FinanceDashboard
//   • Keine Finance‑Logik, keine ContainerA/E/F
//
// Später können hier Astro‑Module ergänzt werden, z. B.:
//   • ContainerAstroA  → Koordinaten / Standort
//   • ContainerAstroB  → Sonnenstand / Mondstand
//   • ContainerAstroC  → Wetterdaten / Seeing
//   • ContainerAstroD  → Beobachtungsplanung
//
// Die Seite ist bewusst minimal gehalten, damit du sie
// schrittweise erweitern kannst.
// --------------------------------------------------------------

export default function AstronomyDashboard() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Astronomy Dashboard</h1>

      <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
        Willkommen im Astronomie‑Bereich deiner Anwendung.
        Dieser Bereich wird künftig Werkzeuge rund um Himmelsmechanik,
        Koordinaten, Wetterdaten, Beobachtungsplanung und weitere
        astronomische Funktionen enthalten.
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>🔭 Geplante Module</h2>
      <ul style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
        <li>Astro‑Koordinaten (RA/DEC, Alt/Az)</li>
        <li>Sonnenstand & Mondstand</li>
        <li>Lokale Wetter‑ und Seeing‑Daten</li>
        <li>Deep‑Sky‑Objekt‑Suche</li>
        <li>Beobachtungsplanung</li>
        <li>Integration der AstroAPI</li>
      </ul>

      <p style={{ marginTop: "2rem", fontSize: "1.05rem" }}>
        Wähle links im Menü ein Tool aus dem Bereich <strong>Astronomy</strong>,
        oder erweitere diesen Bereich nach Bedarf mit neuen Komponenten.
      </p>
    </div>
  );
}
