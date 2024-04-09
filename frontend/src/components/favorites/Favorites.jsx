import React, { useState, useEffect } from 'react';
import './Favorites.css';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/productCard/ProductCard';
import ProductCardPlaceholder from '../../components/productCardSkeleton/ProductCardSkeleton';
import "../../components/card/card.css";

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const productsData = [];

        // Hacer una solicitud para cada ID de producto favorito
        for (const id of storedFavorites) {
          const response = await axios.get(`http://localhost:8080/products/${id}`);
          productsData.push(response.data);
        }

        setFavoriteProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <Container>
<div className="body-container">    
        <Row>
          {loading ? (
            Array.from(Array(10)).map((_, index) => (
              <Col key={index} lg={6} className="image-col">
                {/* Placeholder para la tarjeta del producto */}
                <ProductCardPlaceholder />
              </Col>
            ))
          ) : (
            favoriteProducts
              .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((product, index) => (
                <Col key={index} lg={6} className="image-col">
                  {/* Utiliza el componente ProductCard y aplica los estilos de la tarjeta */}
                  <ProductCard product={product} />
                </Col>
              ))
          )}
        </Row>
      </div>
    </Container>
  );
};

export default Favorites;