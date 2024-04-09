import React, { useState, useEffect } from 'react';
import './home.css';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../../components/productCard/ProductCard';
import ProductCardPlaceholder from '../../components/productCardSkeleton/ProductCardSkeleton';
import "../../components/card/card.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledProducts, setShuffledProducts] = useState([]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page number on search
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        const data = response.data;
        setProducts(data);
        setShuffledProducts(shuffleArray(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  const shuffleArray = array => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const filteredProducts = shuffledProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IMAGES_PER_PAGE = 10;
  const startIndex = currentPage * IMAGES_PER_PAGE;
  const endIndex = Math.min((currentPage + 1) * IMAGES_PER_PAGE, filteredProducts.length);

  return (
    <Container>
      <div className="body-container">
        <div className="main-content">
          <section className="py-2">
            <div className="containerInput">
              <input
                className="form-control inputBuscar"
                value={searchTerm}
                placeholder="Búsqueda por Nombre"
                onChange={handleSearchChange}
              />
            </div>
          </section>
          <Row>
            {loading ? (
              Array.from(Array(10)).map((_, index) => (
                <Col key={index} lg={6} className="image-col">
              </Col>
            ))
          ) : (
            filteredProducts.slice(startIndex, endIndex).map((product, index) => (
              <Col key={index} lg={6} className="image-col"> 
                <ProductCard product={product} />
              </Col>
            ))
          )}
          </Row>
          {filteredProducts.length > IMAGES_PER_PAGE && (
            <div className="pagination-container d-flex justify-content-center">
              <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredProducts.length / IMAGES_PER_PAGE)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                activeClassName={'active'}
                forcePage={currentPage}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
    
  );
};

export default Home;