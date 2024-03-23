import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../productCard/ProductCard';
import ProductCardSkeleton from '../productCardSkeleton/ProductCardSkeleton';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v0/products');
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      const mostrarCardsAleatoriamente = () => {
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        setProducts(shuffledProducts);
      };
  
      mostrarCardsAleatoriamente();
    } else {
      setInitialLoad(false);
    }
  }, [loading]);

  return (
    <Container>
      {error ? (
        <div className="container d-flex justify-content-center">
          <div className="card card-limit">
            <div className="card-header">Alerta</div>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Axios</h5>
              <p className="card-text">Estamos actualizando sistemas</p>
              <p className="card-text">Volvemos en unos minutos con más y mejores sonidos!.</p>
            </div>
          </div>
        </div>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default ProductGrid;
