import React from 'react';
import { Card as BootstrapCard, Button } from 'react-bootstrap';
import './card.css'; // Importa los estilos CSS

const Card = ({ image, title, buttonText }) => {
  return (
    <BootstrapCard className="card">
      <BootstrapCard.Img variant="top" src={image} className="card-img-top" />
      <BootstrapCard.Body>
        <BootstrapCard.Title className="text-center">{title}</BootstrapCard.Title>
        <div className="card-button">
          <Button variant="primary">{buttonText}</Button>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;