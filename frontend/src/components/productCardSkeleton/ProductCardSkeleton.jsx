import React from 'react';
import { Col, Card, Badge, Container, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css"

const ProductCardPlaceholder = () => {
  return (
    <Col xs={12} className="mb-5">
      <Card className="h-100 placeholder-glow" style={{ height: '500px', maxWidth: '100%' }}>
        <div className="position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>
          <Badge bg="dark" text="white">
            <Skeleton width={50} height={20} />
          </Badge>
        </div>
        <Skeleton height={200} style={{ objectFit: 'cover' }} />
        <Card.Body style={{ height: '150px' }}>
          <Card.Title className="text-center fw-bolder">
            <Skeleton width={100} />
          </Card.Title>
          <Container>
            <Row className="justify-content-center mb-2">
              <Skeleton count={5} width={20} style={{ marginRight: '5px' }} />
            </Row>
          </Container>
          <div className="text-center">
            <Skeleton width={50} />
            {' '}
            <Skeleton width={50} />
          </div>
        </Card.Body>
        <Card.Footer style={{ height: '50px' }} className="border-top-0 bg-transparent">
          <div className="text-center">
            <Skeleton width={100} height={40} />
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );

};

export default ProductCardPlaceholder;
