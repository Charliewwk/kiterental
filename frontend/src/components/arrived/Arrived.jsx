import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/productCard/ProductCard';
import ProductCardPlaceholder from '../../components/productCardSkeleton/ProductCardSkeleton';
import "./Arrived.css"

const NewlyArrived = () => {
  const [loading, setLoading] = useState(true);
  const [newlyArrivedProducts, setNewlyArrivedProducts] = useState([]);

  useEffect(() => {
    const fetchNewlyArrivedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products'); // Endpoint para obtener los productos recién llegados
        const data = response.data;
        setNewlyArrivedProducts(data.slice(-10)); // Mostrar solo los últimos 10 productos recién llegados
        setLoading(false);
      } catch (error) {
        console.error('Error fetching newly arrived products:', error);
      }
    };

    fetchNewlyArrivedProducts();
  }, []);

  return (
    <Container>
      <div className="body-container">
        <div className="main-content">
          <Row>
            {loading ? (
              Array.from(Array(10)).map((_, index) => (
                <Col key={index} xs={6} md={4} lg={2} className="image-col">
                  <ProductCardPlaceholder />
                </Col>
              ))
            ) : (
              newlyArrivedProducts.map((product, index) => (
                <Col key={index} xs={6} md={4} lg={2} className="image-col">
                  <ProductCard product={product} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default NewlyArrived;