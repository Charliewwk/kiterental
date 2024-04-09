import React from "react";
import FeaturedProducts from "../featuredProducts/FeaturedProducts";
import PriceRange from "../priceRange/PriceRange";
import { useMediaQuery } from 'react-responsive';
import "./leftbar.css";
import CategoryFilter from "../categoryFilter/CategoryFilter";

const LeftBar = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="left-bar">
      <div className="left-bar-content">
        {!isMobile && (
          <>
          <CategoryFilter />

          </>
        )}
      </div>
    </div>
  );
};

export default LeftBar;
