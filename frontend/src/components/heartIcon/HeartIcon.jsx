import React from "react";
import "./heartIcon.css";

const HeartIcon = ({ onClick, isFavorite }) => {
  return (
    <span
      className={`p-4 heart ${isFavorite ? "is-active" : "no-active"}`}
      onClick={onClick}
    />
  );
};

export default HeartIcon;