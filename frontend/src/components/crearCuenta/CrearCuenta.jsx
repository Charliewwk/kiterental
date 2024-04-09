import React, { useState } from 'react';
import { Form, Button, Container, Modal, Spinner  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const CrearCuenta = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false); 



  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6 || password.includes(' ')) {
      setShowErrorModal(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Usuario registrado exitosamente:', data);
        setShowModal(true);
      } else {
        console.error('Error al registrar usuario');
        setShowErrorModal(true); 
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setShowErrorModal(true); 
    } finally {
      setLoading(false); 
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); 
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Crear cuenta</h1>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3 d-flex justify-content-center align-items-center" controlId="formName">
  <Form.Label className="w-35 text-end mb-0">Nombre:</Form.Label>
  <Form.Control
    className="w-50"
    type="text"
    placeholder="Ingresa tu nombre"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    isInvalid={name.length > 0 && (name.length < 6 || name.includes(' '))}
  />
</Form.Group>
<div style={{ textAlign: 'center', height: '1.5rem', marginBottom: '0.5rem', visibility: (name.length > 0 && (name.length < 6 || name.includes(' '))) ? 'visible' : 'hidden' }}>
  <Form.Text className="text-danger">
    {name.length < 6 && 'El nombre debe tener al menos 6 caracteres. '}
    {name.includes(' ') && 'El nombre no puede contener espacios en blanco.'}
  </Form.Text>
</div>

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
    isInvalid={password.length > 0 && (password.length < 6 || password.includes(' '))}
  />
  
</Form.Group>
<div style={{ textAlign: 'center', height: '1.5rem', marginBottom: '0.5rem', visibility: (password.length > 0 && (password.length < 6 || password.includes(' '))) ? 'visible' : 'hidden' }}>
  <Form.Text className="text-danger">
    {password.length < 6 && 'La contraseña debe tener al menos 6 caracteres. '}
    {password.includes(' ') && 'La contraseña no puede contener espacios en blanco.'}
  </Form.Text>
</div>

        <Button variant="primary" type="submit" className="w-50 mx-auto d-block" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Crear cuenta'}
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registro exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>¡Te has registrado correctamente!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error al registrar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ocurrió un error al intentar registrar el usuario. Por favor, inténtalo nuevamente más tarde.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseErrorModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default CrearCuenta;