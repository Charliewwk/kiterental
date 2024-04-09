import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../../components/authContext/AuthContext'; // Importa AuthContext
import Avatar from "../avatar/avatar";
import ProductForm from "../productForm/ProductForm"; // Importa ProductForm
//import LanguageSelector from "../languageSelector/LanguageSelector"; // Importa LanguageSelector
import ThemeSwitch from "../themeSwitch/ThemeSwitch"; // Importa ThemeSwitch
//import { useGlobal } from "../../context/globalContext/GlobalContext"; // Elimina la importación de useGlobal
import { faUser } from "@fortawesome/free-solid-svg-icons";
import './navbar.css';

function Header() {
  // const { translations } = useGlobal();
  const navbarCollapseRef = useRef(null);
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProductForm, setShowProductForm] = useState(false); // Define setShowProductForm como función de estado

  // Al montar el componente, verifica si el usuario está logueado utilizando localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login(); // Establecer el estado de isLoggedIn a true si hay un token almacenado
    }
  }, [login]); // Asegúrate de que useEffect se ejecute solo cuando cambie la función de login

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    logout(); // Establecer el estado de isLoggedIn a false al cerrar sesión
    navigate('/');
  };

  const handleShowProductForm = () => {
    setShowProductForm(true); // Muestra el formulario de registro de productos
  };

  const handleHideProductForm = () => {
    setShowProductForm(false); // Oculta el formulario de registro de productos
  };

  return (
    <Navbar fixed="top" expand="lg" bg="light" className="bg-body-tertiary navbar-with-margin">
      <Container>
        <Link to="/" className='navbar-brand'>
          <img src={process.env.PUBLIC_URL + '/assets/logos/logo.png'}  height="70" className="d-inline-block align-top" alt="Logo" />
          <span className="name ms-2">Espíritu Libre</span>
        </Link>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0 ms-lg-4">
            <Link to="/about" className="nav-link">Nostros</Link>
            <Link to="/contact" className="nav-link">Contacto</Link>
            <Link to="/favorites" className="nav-link">Favoritos</Link>
            <NavDropdown title="Store" id="navbarDropdown">
              <NavDropdown.Item href="#action/3.1"><Link to="/" className='navbar-brand'>Todos los productos</Link></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2"><Link to="/popular" className='navbar-brand'>Más populares</Link></NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3"><Link to="/arrived" className='navbar-brand'>Nuevos ingresos</Link></NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="d-flex me-2">
            <Link to="/crear-cuenta" className="nav-link">Crear cuenta</Link>      
            {isLoggedIn && (
              <Avatar icon={faUser} backgroundColor="blue" onLogout={handleLogout} setShowProductForm={setShowProductForm} /> // Pasa setShowProductForm como prop
            )}
            {!isLoggedIn && (
              <Link to="/iniciar-sesion" className="nav-link">Iniciar Sesión</Link>
            )}
            <Link to="#" className="nav-link"><ThemeSwitch /></Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {showProductForm && <ProductForm handleClose={handleHideProductForm} />}
    </Navbar>
  );
}

export default Header;