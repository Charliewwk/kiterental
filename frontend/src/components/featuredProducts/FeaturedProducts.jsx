import React from 'react';

const FeaturedProducts = ({ destacados, novedades }) => {
  const productosDestacados = destacados || [
    { id: 1, name: 'Recién ingresados' },
    { id: 2, name: 'Top Ten Alquileres' },
  ];

  const productosNovedades = novedades || [
    { id: 11, name: 'Febrero 2024' },
    { id: 12, name: 'Enero 2024' },
  ];

  return (
    <div className="featured-products">
      <h6>Destacados</h6>
      <ul>
        {productosDestacados.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <h6>Novedades</h6>
      <ul>
        {productosNovedades.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedProducts;
