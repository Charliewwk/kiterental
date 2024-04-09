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
  return (
    <Col xs={12} className="mb-5">
      <Card className="h-100" style={{ height: '500px', maxWidth: '100%' }}>
        {product.isNew && (
          <Badge bg="dark" text="white" className="position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Nuevo</Badge>
        )}
        <Card.Img variant="top" src={product.imageUrl} alt={product.name} style={{ height: '200px' }} />
        <Card.Body style={{ height: '150px' }}>
          <Card.Title className="text-center fw-bolder">
            <a href={`/product/${product.id}`} className="text-decoration-none">{product.name}</a>
          </Card.Title>
          <Row className="justify-content-center mb-2">
            {renderStars(product.rating)}
          </Row>
          <div className="text-center">
            <span className="text-muted text-decoration-line-through">{product.oldPrice}</span>
            USD {' '}
            {product.price}
          </div>
        </Card.Body>
        <Card.Footer style={{ height: '50px' }} className="border-top-0 bg-transparent">
          <div className="text-center">
            <a href={`/product/${product.id}`} className="btn btn-outline-dark mt-auto">Ver Detalles</a>
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default ProductCard;
