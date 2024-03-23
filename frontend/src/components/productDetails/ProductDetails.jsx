import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ProductDetailsFeatures from "../productDetailsFeatures/ProductDetailsFeatures";
import ProductDetailsDescription from "../productDetailsDescription/ProductDetailsDescription";
import ProductDetailsImages from "../productDetailsImages/ProductDetailsImages";
import ProductDetailsHeader from "../productDetailsHeader/ProductDetailsHeader";
import { ProductDetailsDates } from "../productDetailsDates/ProductDetailsDates";

import "./productDetails.css";

function ProductDetail(props) {
  const { id } = useParams();
  const [images, setImages] = useState([
    process.env.PUBLIC_URL + "/assets/images/jb900bk/1.jpg",
    process.env.PUBLIC_URL + "/assets/images/jb900bk/2.jpg",
    process.env.PUBLIC_URL + "/assets/images/jb900bk/3.jpg",
    process.env.PUBLIC_URL + "/assets/images/jb900bk/4.jpg",
    process.env.PUBLIC_URL + "/assets/images/jb900bk/5.jpg",
  ]);

  const features = [
    "Media Lina",
    "8 Sonajas",
    "Con Empuñadura",
    "Negro"
  ];

  const price = 1676.0;
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at dolorem quidem modi. Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius blanditiis delectus ipsam minima ea iste laborum vero?";
  const sku = "JB900BL";
  const title = "Pandereta Knight";

  return (
    <>
      <section className="py-2">
        <Container className="px-1 px-lg-1 my-1">
          <ProductDetailsImages images={images} setImages={setImages} />
        </Container>
      </section>

      <section className="py-2">
        <Container className="px-1 px-lg-1 my-1">
          <Row className="gx-4 gx-lg-5">
            {/* SKU y Título */}
            <Col md={12}>
              <ProductDetailsHeader sku={sku} title={title} id={id} />
            </Col>

            {/* Características */}
            <Col md={12}>
              <ProductDetailsFeatures features={features} />
            </Col>

            {/* Precio y Descripción */}
            <Col md={6} className="pt-2">
              <ProductDetailsDescription
                price={price}
                description={description}
              />
            </Col>

            {/* Selección de fechas */}
            <Col md={6} className="pt-2">
              <ProductDetailsDates />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ProductDetail;
