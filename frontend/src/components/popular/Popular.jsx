import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/productCard/ProductCard';
import ProductCardPlaceholder from '../../components/productCardSkeleton/ProductCardSkeleton';
import "./popular.css"

const Popular = () => {
  const [loading, setLoading] = useState(true);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products'); // Endpoint para obtener los productos más populares
        const data = response.data;
        setPopularProducts(data.slice(0, 10)); // Mostrar solo los primeros 10 productos más populares
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };

    fetchPopularProducts();
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
              popularProducts.map((product, index) => (
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

export default Popular;