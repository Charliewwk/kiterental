import React from 'react';

const ProductDetailsDescription = ({ price, description }) => {
  return (
    <div>
      <div className="fs-5 mb-2">
        <span>${price}</span>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default ProductDetailsDescription;
