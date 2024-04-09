import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';

import './footer.css';

function Footer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '20vh' }}>

      <Navbar className="bg-body-tertiary" fixed="bottom" style={{ display: 'flex', flexDirection: 'column' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="footer-brand">
            <img
              alt=""
              src='/assets/logos/logo.png'
              height="50"
              className="d-inline-block align-top"
            />{' '}
            <span>Kite Rental. Todos los derechos reservados 2024</span>
          </Navbar.Brand>
          <Link to="/politicas-de-reserva">Políticas de reserva</Link>
          <div className="footer-icons">
            <a href="enlace-a-facebook"><i className="fab fa-facebook"></i></a>
            <a href="enlace-a-instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/59893781768"><i className="fab fa-whatsapp"></i></a>
          </div>
        </Container>
      </Navbar>

    </div>
  );
}

export default Footer;