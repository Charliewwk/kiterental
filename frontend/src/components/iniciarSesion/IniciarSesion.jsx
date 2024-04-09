import React, { useState, useContext } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/navbar/NavBar'; // Importa el componente del NavBar
import { AuthContext } from '../authContext/AuthContext'; // Importa el contexto de autenticación

const IniciarSesion = () => {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Nuevo estado para controlar el modal de error
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Usuario logueado exitosamente:', data);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
  
        setShowSuccessModal(true);
        login(true);
      } else {
        setShowErrorModal(true); // Mostrar modal de error si la solicitud no es exitosa
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setShowErrorModal(true); // Mostrar modal de error si hay un error en la solicitud
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <h1 className="text-center mb-4">Iniciar sesión</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 d-flex justify-content-center align-items-center" controlId="formEmail">
            <Form.Label className="w-35 text-end mb-0">Correo electrónico:</Form.Label>
            <Form.Control
              className="w-50"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex justify-content-center align-items-center" controlId="formPassword">
            <Form.Label className="w-35 text-end mb-0">Contraseña:</Form.Label>
            <Form.Control
              className="w-50"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-50 mx-auto d-block">
            Iniciar sesión
          </Button>
        </Form>

        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>Inicio de sesión exitoso</Modal.Title>
          </Modal.Header>
          <Modal.Body>¡Has iniciado sesión correctamente!</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseSuccessModal}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error de inicio de sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>Hubo un problema al iniciar sesión. Por favor, verifica tus credenciales e inténtalo nuevamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseErrorModal}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default IniciarSesion;