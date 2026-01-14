// src/components/Sidebar.jsx
// --------------------------------------------------------------
// Sidebar mit aktivem Highlighting, Bereichs-Routing und
// persistent geöffneten Dropdown-Menüs (bleiben offen nach Klick)
// --------------------------------------------------------------

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { FINANCEAPI_URL } from "../config/apiConfig";
import { ASTROAPI_URL } from "../config/apiConfig";

export default function Sidebar({
  onShowE,
  onShowFortuneOverTime,
}) {
  const navigate = useNavigate();

  // Aktiver Menüpunkt-Stil
  const activeStyle = {
    backgroundColor: "#0d6efd",
    color: "white",
    fontWeight: "bold",
  };

  // ------------------------------------------------------------
  // Dropdown-Zustände
  // ------------------------------------------------------------
  const [showFinanceTools, setShowFinanceTools] = useState(false);
  const [showAstronomyTools, setShowAstronomyTools] = useState(false);
  const [showSystemTools, setShowSystemTools] = useState(false);
  const [showSonstiges, setShowSonstiges] = useState(false);

  // ------------------------------------------------------------
  // Hilfsfunktion: Dropdown offen lassen bei Item-Klick
  // ------------------------------------------------------------
  const keepOpen = (setter) => (isOpen, _event, metadata) => {
    // react-bootstrap schließt Dropdowns bei "select" → ignorieren
    if (metadata?.source === "select") return;
    setter(isOpen);
  };

  // ------------------------------------------------------------
  // Navigation ohne Dropdown zu schließen
  // ------------------------------------------------------------
  const navigateWithoutClosing = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

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
        background: "#000",
      }}
    >
      <Container fluid className="flex-column p-0">

        {/* Brand – lädt Begrüßungsseite */}
        <Navbar.Brand
          href="/"
          onClick={() => window.location.reload()}
          className="d-flex justify-content-center align-items-center m-0 py-3"
        >
          <div className="rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <span className="mx-3">TR</span>
        </Navbar.Brand>

        <hr className="my-0 w-100" />

        <Nav className="flex-column w-100">

          {/* ------------------------------------------------------
             Finanzbereich
          ------------------------------------------------------ */}
          <hr style={{ borderTop: "1px solid #666", margin: "0.5rem 0" }} />

          <Nav.Link
            as={NavLink}
            to="/finance"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            myFortune
          </Nav.Link>

          <NavDropdown
            title="Finance Tools"
            menuVariant="light"
            autoClose="outside"
            show={showFinanceTools}
            onToggle={keepOpen(setShowFinanceTools)}
          >
            <NavDropdown.Item
              onClick={(e) => navigateWithoutClosing(e, "/finance")}
            >
              (A) PUT Ticker to LS
            </NavDropdown.Item>

            <NavDropdown.Item
              onClick={(e) => navigateWithoutClosing(e, "/b")}
            >
              (B) GET Ticker from LS
            </NavDropdown.Item>

            <NavDropdown.Item
              onClick={(e) => {
                e.preventDefault();
                navigate("/finance");
                onShowE();
              }}
            >
              (E) getquote yFinance
            </NavDropdown.Item>

            <NavDropdown.Item
              onClick={(e) => {
                e.preventDefault();
                navigate("/finance");
                onShowFortuneOverTime();
              }}
            >
              (F) Fortune over time (React)
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item
              href="getfulldatayfinance/getfulldatayfinance.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              getfulldata yFinance
            </NavDropdown.Item>
          </NavDropdown>

          {/* ------------------------------------------------------
             Astronomie-Bereich
          ------------------------------------------------------ */}
          <hr style={{ borderTop: "1px solid #666", margin: "0.5rem 0" }} />

          <Nav.Link
            as={NavLink}
            to="/astronomy"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Astronomy
          </Nav.Link>

          <NavDropdown
            title="Astronomy Tools"
            menuVariant="light"
            autoClose="outside"
            show={showAstronomyTools}
            onToggle={keepOpen(setShowAstronomyTools)}
          >
            <NavDropdown.Item
              href="getgpsdata/geokoordinaten.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              Geolocation
            </NavDropdown.Item>

            <NavDropdown.Item
              href="getweatherdata/getopenweatherinfo.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              OpenWeather
            </NavDropdown.Item>
          </NavDropdown>

          {/* ------------------------------------------------------
             Sonstiges
          ------------------------------------------------------ */}
          <hr style={{ borderTop: "1px solid #666", margin: "0.5rem 0" }} />

          <NavDropdown
            title="Sonstiges"
            menuVariant="light"
            autoClose="outside"
            show={showSonstiges}
            onToggle={keepOpen(setShowSonstiges)}
          >
            <NavDropdown.Item
              href="livecams/livecams.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              LiveCams
            </NavDropdown.Item>

            <NavDropdown.Item
              href="economicrules/economicrules.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              EconomicRules
            </NavDropdown.Item>

            <NavDropdown.Item
              href="treinadorportugues/treinadorportugues.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              Treinador Portugues
            </NavDropdown.Item>
          </NavDropdown>

          {/* ------------------------------------------------------
             System-Bereich
          ------------------------------------------------------ */}
          <hr style={{ borderTop: "1px solid #666", margin: "0.5rem 0" }} />

          <Nav.Link
            as={NavLink}
            to="/system"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            System
          </Nav.Link>

          <NavDropdown
            title="System Tools"
            menuVariant="light"
            autoClose="outside"
            show={showSystemTools}
            onToggle={keepOpen(setShowSystemTools)}
          >
            <NavDropdown.Item
              onClick={(e) => navigateWithoutClosing(e, "/system")}
            >
              Check Server
            </NavDropdown.Item>

            <NavDropdown.Item
              href={`${ASTROAPI_URL}/docs`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              FastAPI ASTRO Swagger
            </NavDropdown.Item>

            <NavDropdown.Item
              href={`${FINANCEAPI_URL}/docs`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              FastAPI FINANCE Swagger
            </NavDropdown.Item>

            <NavDropdown.Item
              href="#"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              matplotlib
            </NavDropdown.Item>

            <NavDropdown.Item
              href="webcam.html"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              live USB Cam
            </NavDropdown.Item>
          </NavDropdown>

          {/* NN */}
          <hr style={{ borderTop: "1px solid #666", margin: "0.5rem 0" }} />
          <Nav.Link onClick={() => console.log("NN")}>NN</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
