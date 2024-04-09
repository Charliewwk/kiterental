import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const NoPage = () => {
  return (
    <Container>
      <div style={styles.container}>
        <div style={styles.imageContainer}>
          <img src={process.env.PUBLIC_URL + '/assets/images/grua.jpg'} alt="Grua" style={styles.image} />
          <span style={styles.number}>404</span>
        </div>
        <p style={styles.text}>Lo sentimos<br/>No se encuentra la página que estás buscando.</p>
        <Button as={Link} to="/" variant="primary">Volver a la página de inicio</Button>
      </div>
    </Container>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  imageContainer: {
    position: 'relative',
    width: '300px',
    margin: '0 auto',
  },
  image: {
    maxWidth: '100%',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    padding: '20px',
  },
  number: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#f00',
  },
  text: {
    fontSize: '1em',
    marginTop: '20px',
    marginBottom: '30px',
  },
};

export default NoPage;
