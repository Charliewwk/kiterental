import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from 'axios';
import { useParams } from "react-router-dom";

const ActualizarPerfil = ({ show, handleClose }) => {
    const { id } = useParams();
    const userId = parseInt(localStorage.getItem('userId')); 
    const [formData, setFormData] = useState({
      name:"",
      email:"",
      role:"",
      password:"",
      id: userId
    });
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false); 
  
    useEffect(() => {
      setShowModal(false);
    }, [show, userId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const updatedFormData = {
          id: userId,
          email: formData.email,
          userRole: formData.role,
          password: formData.password,
          active: true
        };
        try {
          const token = localStorage.getItem('token'); 
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          const response = await axios.put(`http://localhost:8080/users/update/${userId}`, updatedFormData, config);
          if (response.status === 200) {
            setMessage("¡Perfil actualizado correctamente!");
            setShowModal(true);
          }
        } catch (error) {
          setMessage("Error al actualizar el perfil. Por favor, inténtalo de nuevo más tarde.");
          console.error('Error al actualizar el perfil:', error);
          setShowModal(true);
        }
      };
  
    const handleModalClose = () => {
      setShowModal(false);
      setMessage("");
      handleClose();
      window.location.reload();
    };
  
    return (
      <>
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{message}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Actualizar Perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Actualiza el nombre del usuario"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Actualiza tu email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Actualiza tu role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
                </Form.Group>
                <Form.Group controlPassword="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Actualiza tu password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Actualizar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  
  export default ActualizarPerfil;