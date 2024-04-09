import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Modal, Spinner, Carousel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../../components/authContext/AuthContext';
import UpdateForm from "../../components/UpdateForm/UpdateForm";
import ProductDetailsFeatures from "../productDetailsFeatures/ProductDetailsFeatures";
import ProductDetailsDescription from "../productDetailsDescription/ProductDetailsDescription";
import ProductDetailsHeader from "../productDetailsHeader/ProductDetailsHeader";
import "./productDetails.css";
import { useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [images, setImages] = useState([]); 
  const navigate = useNavigate();
  const [showReservationConfirmation, setShowReservationConfirmation] = useState(false); 
  const [isFavorite, setIsFavorite] = useState(false); // State para representar si el producto es favorito o no

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(storedFavorites.includes(id));
    
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:8080/products/${id}`);
        const productData = productResponse.data;
        setProduct(productData);

        // Verificar si el producto está marcado como favorito en el localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(storedFavorites.includes(id));

        const secondaryImagesResponse = await axios.get(`http://localhost:8080/images/products/${id}`);
        
        if (secondaryImagesResponse.status === 200) {
          const secondaryImagesData = secondaryImagesResponse.data;
          const secondaryImageUrls = secondaryImagesData.map(imageData => imageData.url);
          
          if (secondaryImageUrls.length > 0) {
            setImages([productData.imageUrl, ...secondaryImageUrls]);
          } else {
            setImages([productData.imageUrl]); 
          }
        } else {
          setImages([productData.imageUrl]); 
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchProduct();
  }, [id]);

  // Función para manejar el clic en el corazón
  const handleFavoriteClick = () => {
    // Invertir el estado de favorito
    setIsFavorite(prevState => !prevState);

    // Actualizar el localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = isFavorite ? storedFavorites.filter(favorite => favorite !== id) : [...storedFavorites, id];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleReserve = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowReserveModal(true);
    }
  };

  const handleConfirmReserve = async () => {
    if (!startDate || !endDate) {
      alert("Por favor seleccione fechas válidas.");
      return;
    }

    const today = new Date();
    if (startDate < today || endDate < today) {
      alert("No puede seleccionar fechas anteriores a hoy.");
      return;
    }

    setLoading(true);

    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const totalPrice = product.price * duration;
    setTotalPrice(totalPrice);

    const userId = parseInt(localStorage.getItem('userId'));
    const rentDate = today.toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:8080/rents', {
        userId,
        productId: product.id,
        rentDate,
        startDate,
        endDate
      });

      setShowReserveModal(false);
      setShowReservationConfirmation(true);
    } catch (error) {
      console.error('Error al enviar la solicitud de reserva:', error);
    } finally {
      setLoading(false); // Establecer carga a false una vez que se completa la reserva, independientemente de si hay un error o no
    }
  };

  const handleDelete = async () => {
    try {
      if (!isLoggedIn) {
        setShowLoginModal(true);
      } else {
        setShowDeleteConfirmation(true);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true); // Establecer carga a verdadero mientras se procesa la eliminación del producto
      await axios.delete(`http://localhost:8080/products/${id}`);
      console.log('Product deleted successfully.');
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteSuccess(false);
        setRedirectToHome(true);
      }, 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowDeleteError(true); // Establecer el estado de mostrar error en true
    } finally {
      setLoading(false); // Establecer la carga a falso una vez que se completa la solicitud, independientemente de si hay un error o no
    }
  };

  const handleUpdate = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowUpdateForm(true);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate) {
      const duration = (endDate - date) / (1000 * 60 * 60 * 24);
      const totalPrice = product.price * duration;
      setTotalPrice(totalPrice);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date && startDate) {
      const duration = (date - startDate) / (1000 * 60 * 60 * 24);
      const totalPrice = product.price * duration;
      setTotalPrice(totalPrice);
    }
  };

  if (redirectToHome) {
    navigate('/');
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const { imageUrl, features, price, description, sku, name, createdDate, updatedDate } = product;

  return (
    <>
    <div className="body-container"></div>
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Debes iniciar sesión para continuar.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReserveModal} onHide={() => setShowReserveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Fecha de Inicio:</p>
            <DatePicker selected={startDate} onChange={handleStartDateChange} minDate={new Date()} />
          </div>
          <div>
            <p>Fecha de Fin:</p>
            <DatePicker selected={endDate} onChange={handleEndDateChange} minDate={startDate} />
          </div>
          <p>Total a Pagar: {totalPrice}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReserveModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmReserve}>
            Confirmar Reserva
          </Button>
          {loading && (
            <div className="overlay"></div>
          )}

          {loading && (
            <div className="loading-overlay">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      <section className="py-2">
        <Container className="px-1 px-lg-1 my-1">
          <Row className="gx-4 gx-lg-5">
            <Col md={6} className="pb-2">
              {/* Renderizar el carrusel de imágenes */}
              <Carousel fade>
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`Slide ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col md={6} className="pb-2">
              <Row>
                {images.slice(1, 5).map((image, index) => (
                  <Col key={index} xs={6} className="mb-3">
                    <img
                      src={image}
                      alt={`Image ${index + 2}`}
                      className="img-fluid"
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={12}>
            <ProductDetailsHeader sku={sku} title={name} id={id} isFavorite={isFavorite} handleFavoriteClick={handleFavoriteClick} />
          </Col>
            <Col md={12}>
              {features && <ProductDetailsFeatures features={features} />}
            </Col>
            <Col md={6} className="pt-2">
              <ProductDetailsDescription
                price={price}
                description={description}
              />
            </Col>
            <Col md={6} className="pt-2">
              <p><strong>Created Date:</strong> {new Date(createdDate).toLocaleDateString()}</p>
            </Col>
            <Col md={12} className="text-center pt-4">
              <div className="button-container">
                <Button variant="primary" onClick={handleReserve}>Reservar</Button>
                <Button variant="primary" onClick={handleDelete}>Eliminar Producto</Button>
                <Button variant="primary" onClick={handleUpdate}>Actualizar producto</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {showUpdateForm && (
        <UpdateForm
          show={showUpdateForm}
          handleClose={() => setShowUpdateForm(false)}
        />
      )}

      <Modal show={showDeleteSuccess} onHide={() => setShowDeleteSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Producto Eliminado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El producto ha sido eliminado exitosamente.</p>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteError} onHide={() => setShowDeleteError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error al Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ocurrió un error al intentar eliminar el producto. Por favor, inténtalo de nuevo más tarde.</p>
        </Modal.Body>
      </Modal>
      <Modal show={showReservationConfirmation} onHide={() => setShowReservationConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Reserva Confirmada!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>La reserva del producto ha sido confirmada con éxito.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductDetail;