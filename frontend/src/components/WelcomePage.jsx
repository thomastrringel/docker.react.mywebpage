// src/components/WelcomePage.jsx
// --------------------------------------------------------------
// WelcomePage
// --------------------------------------------------------------
// Dies ist die neue neutrale Startseite deiner Webanwendung.
// Sie erscheint unter "/" und dient als Begrüßungs- und
// Orientierungspunkt für die drei Hauptbereiche:
//
//   • Finance (FinanceAPI)
//   • Astronomy (AstroAPI)
//   • System (CheckServer, Tools)
//
// Die Seite enthält keine Logik und keine Container.
// Sie ist bewusst leichtgewichtig gehalten.
// --------------------------------------------------------------

export default function WelcomePage() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Willkommen auf deiner Webplattform</h1>

      <p style={{ fontSize: "1.1rem" }}>
        Diese Anwendung vereint mehrere eigenständige Bereiche, die jeweils
        unterschiedliche Funktionen bereitstellen. Über die linke Navigation
        kannst du jederzeit zwischen den Modulen wechseln.
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>🔹 Finance</h2>
      <p>
        Der Finanzbereich bietet dir Werkzeuge rund um Aktien, Tickerlisten,
        Kursabfragen und historische Auswertungen.  
        Die Daten stammen aus deiner eigenen <strong>FinanceAPI</strong> sowie
        externen Quellen wie <em>yFinance</em>.
      </p>

      <h2>🔹 Astronomy</h2>
      <p>
        Der Astronomie‑Bereich wird künftig Funktionen rund um
        Himmelsmechanik, Koordinaten, Wetterdaten und Beobachtungsplanung
        enthalten.  
        Die Daten stammen aus deiner <strong>AstroAPI</strong> und weiteren
        externen Diensten.
      </p>

      <h2>🔹 System</h2>
      <p>
        Im Systembereich findest du Diagnose‑ und Verwaltungswerkzeuge wie
        Serverstatus, Swagger‑Dokumentationen und weitere technische Tools.
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <p style={{ fontSize: "1.05rem" }}>
        Wähle links im Menü einen Bereich aus, um zu starten.  
        Diese Startseite bleibt bewusst neutral und lädt dich ein, die
        verschiedenen Module deiner Anwendung zu erkunden.
      </p>
    </div>
  );
}
