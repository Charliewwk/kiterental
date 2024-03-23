import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./productDetailsImages.css";

const ProductDetailsImages = ({ images, setImages }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const changeMainImage = (index) => {
    const newImages = [...images];
    const temp = newImages[0];
    newImages[0] = newImages[index];
    newImages[index] = temp;
    setImages(newImages);
  };

  return (
    <Row className="gx-4 gx-lg-5">
      {/* Imagen principal */}
      <Col md={6}>
        <section className="main_image">
          <Image
            id="mainImage"
            className="card-img-top mb-1 mb-md-0 img-thumbnail"
            src={images[0]}
            alt="Main Image"
          />
        </section>
      </Col>
      {/* Imágenes secundarias */}
      <Col md={6}>
        <section className={`secondary_images ${isMobile ? "mobile" : ""}`}>
          <Row>
            {images.slice(1, isMobile ? 5 : undefined).map((image, index) => (
              <Col
                key={index + 1}
                xs={isMobile ? 3 : 6}
                md={6}
                className="mb-1 mb-md-1 mt-md-2"
              >
                <Image
                  className="img-thumbnail"
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => changeMainImage(index + 1)}
                />
              </Col>
            ))}
          </Row>
        </section>
      </Col>
    </Row>
  );
};

export default ProductDetailsImages;
