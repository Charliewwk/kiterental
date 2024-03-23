import React, { useState, useEffect } from "react";
import HeartIcon from "../heartIcon/HeartIcon";
import { useGlobal } from "../../context/globalContext/GlobalContext";

const ProductDetailsHeader = ({ sku, title, id }) => {
  const [products, setProducts] = useState([]);
  const { favoriteProducts, favoriteDispatch } = useGlobal();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div>
      <div className="small d-flex justify-content-between">
        <span>
          SKU: {sku} {id}
        </span>
        <small>Ver más</small>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="display-6 fw-bolder">{title}</span>
        <HeartIcon />
      </div>
    </div>
  );
};

export default ProductDetailsHeader;
