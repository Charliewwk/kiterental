import React, { useState } from 'react';
import PriceRangeFilter from './PriceRangeFilter';

const PriceRange = () => {
    const [priceRange, setPriceRange] = useState(50);

    const handlePriceRangeChange = (event) => {
      setPriceRange(event.target.value);
    };
  
    return (
      <div>
        <h6>Rango de Precios</h6>
        <PriceRangeFilter min={0} max={100} value={priceRange} onChange={handlePriceRangeChange} />
      </div>
    );
  };
export default PriceRange
