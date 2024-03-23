import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';

import './footer.css'

function Footer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <Navbar className="bg-body-tertiary" fixed="bottom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="footer-brand">
            <img
              alt=""
              src={process.env.PUBLIC_URL + '/assets/logos/logo_hhr.png'}
              width="28"
              height="21"
              className="d-inline-block align-top"
            />{' '}
            <span>hiHat Rental. Todos los derechos reservados 2024</span>
          </Navbar.Brand>
          {!isMobile && (
            <Navbar.Text className="footer-dashboard d-none d-lg-block">
              <img
                alt=""
                src={process.env.PUBLIC_URL + '/assets/svg/user/admin.svg'}
                width="16"
                height="16"
                className="d-inline-block"
              />
              <span>Dashboard</span>
            </Navbar.Text>
          )}
        </Container>
      </Navbar>

    </div>
  );
}

export default Footer;
