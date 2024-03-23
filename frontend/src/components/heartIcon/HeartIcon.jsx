import React, { useState, useEffect } from "react";
import { useGlobal } from "../../context/globalContext/GlobalContext"
import "./heartIcon.css";

const HeartIcon = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    
    const handleToggleFavorite = () => {
      console.log (`Product id: `, `X`, ` ahora es `, isFavorite ? "No favorito" : "Favorito")
      setIsFavorite(!isFavorite);
    };
    
    return (
        <span className={`p-4 heart ${isFavorite ? "is-active" : "no-active"}`}
          onClick={handleToggleFavorite}
      />
    );
  };
  
  export default HeartIcon;