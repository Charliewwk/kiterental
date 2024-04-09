import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/productCard/ProductCard';
import ProductCardPlaceholder from '../../components/productCardSkeleton/ProductCardSkeleton';
import { Container, Row, Col } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';

const FilteredProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams(); // Obtener el parámetro categoryName de la URL

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/products?category=${encodeURIComponent(categoryName)}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    };

    fetchProductsByCategory();
  }, [categoryName]); // Asegúrate de que useEffect se ejecute cuando categoryName cambie

  return (
    <Container>
      <div className="body-container">
        <div className="main-content">
          <Row>
            {loading ? (
              Array.from(Array(10)).map((_, index) => (
                <Col key={index} lg={6} className="image-col">
                  {/* Placeholder */}
                </Col>
              ))
            ) : (
              products.map((product, index) => (
                <Col key={index} lg={6} className="image-col"> 
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

export default FilteredProductsPage;