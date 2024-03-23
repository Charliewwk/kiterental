import React from "react";
import SearchBar from "../searchBar/SearchBar";
import CategoryFilter from "../categoryFilter/CategoryFilter";
import FeaturedProducts from "../featuredProducts/FeaturedProducts";
import PriceRange from "../priceRange/PriceRange";
import { useMediaQuery } from 'react-responsive';
import "./leftbar.css";

const LeftBar = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="left-bar">
      <div className="left-bar-content">
        <SearchBar />
        <CategoryFilter />
        {!isMobile && (
          <>
{/*             <FeaturedProducts />
            <PriceRange />
 */}          </>
        )}
      </div>
    </div>
  );
};

export default LeftBar;
