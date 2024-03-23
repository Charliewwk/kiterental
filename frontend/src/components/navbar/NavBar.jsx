import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useGlobal } from "../../context/globalContext/GlobalContext";
import LanguageSelector from "../languageSelector/LanguageSelector";
import ThemeSwitch from "../themeSwitch/ThemeSwitch";

import './navbar.css';

function Header() {
  const { theme, language, languageDispatch, translations } = useGlobal();
  const navbarCollapseRef = useRef(null);

  const handleLanguageChange = (selectedLanguage) => {
    languageDispatch({ type: "TOGGLE_LANGUAGE", payload: selectedLanguage });
  };
  
  const closeNavbar = () => {
    if (navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.remove("show");
    }
  };

  return (
    <Navbar fixed="top" expand="lg" bg="light" className="bg-body-tertiary">
      <Container>
        <Link to="/" className='navbar-brand'>
          <img src={process.env.PUBLIC_URL + '/assets/logos/logo_hhr.png'} width="60" height="35" className="d-inline-block align-top" alt="Logo" />
          <span className="name ms-2">Sonidos del Alma</span>
        </Link>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0 ms-lg-4">
              <Link to="/about" className="nav-link">{translations.about}</Link>
              <Link to="/contact" className="nav-link">{translations.contact}</Link>
              <Link to="/favorites" className="nav-link">{translations.favorites}</Link>
              <NavDropdown title="Store" id="navbarDropdown">
              <NavDropdown.Item href="#action/3.1">All products</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">Most popular</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Newly arrived</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="d-flex me-2">
            <Link to="" className="nav-link">
              <img src={process.env.PUBLIC_URL + '/assets/svg/navbar/cart-fill.svg'} width="16" height="16" alt="Cart" />
              <span className="badge bg-dark text-white ms-1 rounded-pill">5</span>
            </Link>
            <Link to="/signup" className="nav-link">Crear cuenta</Link>
            <Link to="/signin" className="nav-link">Iniciar sesión</Link>
            <Link to="#" className="nav-link"><LanguageSelector handleLanguageChange={handleLanguageChange} /></Link>
            <Link to="#" className="nav-link"><ThemeSwitch /></Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
