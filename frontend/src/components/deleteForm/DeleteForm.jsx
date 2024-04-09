/*import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from 'axios';

const DeleteForm = ({ show, handleClose, onLogout }) => {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/users/delete/${userId}`);
      if (response.status === 204) {
        setMessage("Cuenta eliminada correctamente!");
        setShowModal(true);
        // Cerrar sesión y limpiar el almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        onLogout();
      }
    } catch (error) {
      setMessage("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
      console.error('Error al eliminar la cuenta:', error);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMessage("");
    handleClose();
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
          <Modal.Title>Eliminar Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
          <Button variant="danger" onClick={handleSubmit}>
            Sí, eliminar cuenta
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteForm; */


import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

class DeleteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleDelete = () => {
    const userId = localStorage.getItem('userId');
    axios.delete(`http://localhost:8080/users/delete/${userId}`)
      .then(response => {
        if (response.status === 204) {
          // Cuenta eliminada correctamente
          console.log("Cuenta eliminada correctamente");
          // Llamar a la función de cierre proporcionada para cerrar el formulario
          this.props.handleClose();
          // Llamar a la función de cierre de sesión proporcionada para cerrar la sesión del usuario
          this.props.onLogout();
        } else {
          // Manejar otros códigos de estado si es necesario
          console.log("Error al eliminar la cuenta");
          this.setState({ error: "Error al eliminar la cuenta" });
        }
      })
      .catch(error => {
        // Manejar errores de red u otros errores
        console.error("Error al eliminar la cuenta:", error);
        this.setState({ error: "Error al eliminar la cuenta" });
      });
  };

  render() {
    const { show, handleClose } = this.props;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
          {this.state.error && <p>Error: {this.state.error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={this.handleDelete}>
            Eliminar cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteForm;