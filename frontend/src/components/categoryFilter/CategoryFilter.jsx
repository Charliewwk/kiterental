import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const CategoryFilter = ({ categories }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const tempCategories = categories || [
    { id: 1, name: 'Guitarras' },
    { id: 2, name: 'Bajos' },
    { id: 3, name: 'Baterias' },
    { id: 4, name: 'Pianos Teclados' },
    { id: 5, name: 'Viento' },
    { id: 6, name: 'Percusión' },
    { id: 7, name: 'Electrónicos' },
    { id: 8, name: 'Accesorios' }
  ];

  return (
    <section className="py-2">
      <div className="category-filter">
        {isMobile ? (
          <> 
          <DropdownButton id="category-dropdown" title="Categorías">
            {tempCategories.slice(0, 10).map(category => (
              <Dropdown.Item key={category.id}>
                <Link to={`/categoria/${category.id}`}>{category.name}</Link>
              </Dropdown.Item>
            ))}
          </DropdownButton>
          </>
        ) : (
          <>
          <h6>Categorías</h6>
          <ul>
            {tempCategories.slice(0, 10).map(category => (
              <li key={category.id}>
                <Link to={`/categoria/${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{category.name}</Link>
              </li>
            ))}
          </ul>
          <p className="text-muted small"><Link to="/categorias" style={{ textDecoration: 'none', color: 'inherit' }}>Mostrar todas</Link></p>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;
