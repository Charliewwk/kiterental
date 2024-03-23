import React from 'react';
import NavBar from '../navbar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import { Container } from 'react-bootstrap';
import LeftBar from '../leftBar/LeftBar';
import "./layout.css"

const Layout = () => {
  return (
    <div>
    <Container>
      <NavBar />
        <div className="body-container">
          <div className="left-bar">
            <LeftBar />
          </div>
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      <Footer />
    </Container>

    </div>
  );
};

export default Layout;