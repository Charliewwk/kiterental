import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }
  return stars;
};


const ProductCard = ({ product }) => {

  const formattedPrice = `$${((product.price)*1.2).toFixed(2)}`;
  const formattedPriceDiscount = `$${((product.price)*1).toFixed(2)}`;

  return (
    <Col xs={6} className="mb-5">
      <Card className="h-100" style={{ height: '500px', maxWidth: '100%' }}>
        <Card.Img variant="top" src={product.imageUrl} alt={product.name} style={{ height: '200px' }} />
        <Card.Body style={{ height: '100px' }}>
          <Card.Title className="text-center fw-bolder">
            <a href={`/product/${product.id}`} className="text-decoration-none">{product.name}</a>
          </Card.Title>
          <Row className="justify-content-center mb-2">
            {renderStars(product.rating)}
          </Row>
        </Card.Body>
        <Card.Footer style={{ height: '60px' }} className="border-top-0 bg-transparent d-flex justify-content-between align-items-center">
            <div className="mr-2">
              <span className="text-muted small text-decoration-line-through">{formattedPriceDiscount}</span>
              {' '}
              {formattedPrice}
            </div>
            <div>
              <a href={`/product/${product.id}`} className="btn btn-outline-dark mt-auto">Reservar</a>
            </div>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default ProductCard;
