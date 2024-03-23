import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";

export const ProductDetailsDates = () => {
  return (
    <div>
      <InputGroup className="mt-3">
        <InputGroup.Text>Desde</InputGroup.Text>
        <FormControl type="text" placeholder="Fecha de inicio" />
        <InputGroup.Text>Hasta</InputGroup.Text>
        <FormControl type="text" placeholder="Fecha de fin" />
      </InputGroup>
      <div className="d-flex mt-3">
        <FormControl
          className="text-center me-3"
          type="number"
          defaultValue="1"
          style={{ maxWidth: "3rem" }}
        />
        <Button variant="outline-dark">
          <i className="bi-cart-fill me-1"></i>
          Reservar
        </Button>
      </div>
    </div>
  );
};
