import React from 'react'
import { useGlobal } from "../../context/GlobalContext";

const loading = () => {
  const { translations } = useGlobal();

  return (
    <div className="container text-center">
      <h6>{translations.loading}</h6>
  </div>
  )
}

export default loading