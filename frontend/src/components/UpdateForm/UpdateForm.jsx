import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from 'axios';
import { useParams } from "react-router-dom";
import "./UpdateForm.css"

const UpdateForm = ({ show, handleClose, match }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name:"",
    description:"",
    category: "",
    price: "",
    active: "",
    imageUrl:""
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(false);
    fetchProductDetails();
    fetchCategories();
  }, [show, id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/products/${id}`);
      const productData = response.data;
      setFormData({
        name: productData.name,
        description: productData.description,
        category: productData.categories[0].name, 
        price: productData.price,
        active: productData.active,
        imageUrl: productData.imageUrl
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
      const response = await axios.put(`http://localhost:8080/products/${id}`, formData);
      if (response.status === 200) {
        setMessage("Producto Actualizado Correctamente!");
        setShowModal(true);
      }
    } catch (error) {
      setMessage("Error al actualizar el producto. Por favor, inténtalo de nuevo más tarde.");
      console.error('Error al actualizar el producto:', error);
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
          <Modal.Title>Actualizar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Actualiza el nombre del producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Actualiza la descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Actualiza el precio"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImageUrl">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Actualiza la URL de la imagen"
                name="imageUrl"
                value={formData.imageUrl}
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

export default UpdateForm;
