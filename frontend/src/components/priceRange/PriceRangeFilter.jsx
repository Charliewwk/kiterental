import React from 'react';
import RangeSlider from 'react-bootstrap-range-slider';

const PriceRangeFilter = ({ min, max, value, onChange }) => {
  return (
    <div className="price-range-filter">
      <RangeSlider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        tooltip="auto"
      />
    </div>
  );
};

export default PriceRangeFilter;
