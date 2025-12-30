// React Router Link nur für echte Seiten verwenden
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

export default function Sidebar({ onShowE }) {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand={false}
      className="flex-column"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "250px",
        overflowY: "auto",
        zIndex: 1000,
        background: "#000"
      }}
    >
      <Container fluid className="flex-column p-0">

        {/* Brand – lädt die komplette Seite neu */}
        <Navbar.Brand
          href="/"
          onClick={() => {
            console.log("Reload triggered");
            window.location.reload();
          }}
          className="d-flex justify-content-center align-items-center m-0 py-3"
        >
          <div className="rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <span className="mx-3">TR</span>
        </Navbar.Brand>

        <hr className="my-0 w-100" />

        <Nav className="flex-column w-100">

          {/* Interne Seite über Router (falls du später eine echte Dashboard-Seite willst) */}
          <Nav.Link as={Link} to="/">MyDashboard</Nav.Link>

          {/* myFortune */}
          <NavDropdown
            title="myFortune"
            menuVariant="light"
            className="text-light"
          >

            {/* (A) – dynamischer Container, NICHT über Router */}
            <NavDropdown.Item
              onClick={() => {
                console.log("Load A");
                // später: onShowA() wenn du A dynamisch machen willst
              }}
            >
              (A) PUT Ticker to LS
            </NavDropdown.Item>

            {/* (B) – Beispiel für echte Router-Navigation */}
            <NavDropdown.Item 
              as={Link} 
              to="/b"
            >
              (B) GET Ticker from LS
            </NavDropdown.Item>

            <NavDropdown.Divider />

            {/* Externe HTML-Seite */}
            <NavDropdown.Item
              href="fortune/fortuneovertime.html"
              target="_blank"
            >
              Fortune over time
            </NavDropdown.Item>

            {/* (E) – dynamischer Container, NICHT über Router */}
            <NavDropdown.Item
              onClick={() => {
                console.log("Load E");
                onShowE();   // Container E unter A einblenden
              }}
            >
              (E) getquote yFinance
            </NavDropdown.Item>

            {/* Externe HTML-Seite + Aktion */}
            <NavDropdown.Item 
              href="getfulldatayfinance.html" 
              target="_blank" 
              onClick={() => console.log("Load E")}
            >
              getfulldata yFinance
            </NavDropdown.Item>

            {/* (C) – dynamisch oder später Router, aktuell nur Aktion */}
            <NavDropdown.Item 
              onClick={() => console.log("Load C")}
            >
              (C) get_quote FMP
            </NavDropdown.Item>

            {/* (F) – dynamisch oder später Router */}
            <NavDropdown.Item 
              onClick={() => console.log("Load F")}
            >
              (F) test2 - php
            </NavDropdown.Item>
          </NavDropdown>

          {/* Astronomy – alles externe Tools */}
          <NavDropdown title="Astronomy" menuVariant="light">
            <NavDropdown.Item
              href="geokoordinaten.html"
              target="_blank"
            >
              Geolocation
            </NavDropdown.Item>

            <NavDropdown.Item
              href="getopenweatherinfo.html"
              target="_blank"
            >
              OpenWeather
            </NavDropdown.Item>
          </NavDropdown>

          {/* Sonstiges – externe Tools */}
          <NavDropdown title="Sonstiges" menuVariant="light">
            <NavDropdown.Item
              href="livecams/livecams.html"
              target="_blank"
            >
              LiveCams
            </NavDropdown.Item>

            <NavDropdown.Item href="economicrules/economicrules.html">
              EconomicRules
            </NavDropdown.Item>
          </NavDropdown>

          {/* System – externe Tools */}
          <NavDropdown title="System" menuVariant="light">
            <NavDropdown.Item onClick={() => console.log("Check Server")}>
              Check Server
            </NavDropdown.Item>

            <NavDropdown.Item
              href="http://localhost:8001/docs"
              target="_blank"
            >
              FastAPI Swagger
            </NavDropdown.Item>

            <NavDropdown.Item
              href="http://localhost:8001/redoc"
              target="_blank"
            >
              FastAPI Redoc
            </NavDropdown.Item>

            <NavDropdown.Item href="#" target="_blank">
              matplotlib
            </NavDropdown.Item>

            <NavDropdown.Item href="webcam.html" target="_blank">
              live USB Cam
            </NavDropdown.Item>
          </NavDropdown>

          {/* NN – nur Aktion */}
          <Nav.Link onClick={() => console.log("NN")}>NN</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
