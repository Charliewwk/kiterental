import React from "react";
import HeartIcon from "../heartIcon/HeartIcon";

const ProductDetailsHeader = ({ sku, title, id, isFavorite, handleFavoriteClick }) => {
  return (
    <div>
      <div className="small d-flex justify-content-between"></div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="display-6 fw-bolder">{title}</span>
        {/* Pasar la función handleFavoriteClick al componente HeartIcon */}
        <HeartIcon onClick={handleFavoriteClick} isFavorite={isFavorite} />
      </div>
    </div>
  );
};

export default ProductDetailsHeader;