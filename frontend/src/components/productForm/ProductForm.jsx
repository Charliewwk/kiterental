import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from 'axios';

const ProductForm = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    price: "",
    category: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal en el formulario

  useEffect(() => {
    setShowModal(false); // Asegurar que el modal no se muestre al principio
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/products', formData);
      if (response.status === 201) {
        setMessage("¡Producto agregado correctamente!");
        setShowModal(true); // Mostrar el modal solo después de registrar el producto

      }
    } catch (error) {
      setMessage("Error al agregar el producto. Por favor, inténtalo de nuevo más tarde.");
      console.error('Error al agregar el producto:', error);
      setShowModal(true); // Mostrar el modal en caso de error también
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
          <Modal.Title>Registrar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUrl">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la URL de la imagen"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el precio del producto"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la categoría del producto"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingresa una descripción del producto"
                name="description"
                value={formData.description}
                onChange={handleChange} 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Registrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductForm;