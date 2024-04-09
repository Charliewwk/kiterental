import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

const CategoryFilter = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryName) => {
    try {
      const response = await axios.get(`http://localhost:8080/products?category=${encodeURIComponent(categoryName)}`);
      onCategorySelect(response.data);
      navigate(`/products/${encodeURIComponent(categoryName)}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  return (
    <section className="py-2">
      <div className="category-filter">
        {isMobile ? (
          <DropdownButton name="category-dropdown" title="Categorías">
            {categories.map(category => (
              <Dropdown.Item key={category.name} onClick={() => handleCategoryClick(category.name)}>
                {category.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        ) : (
          <>
            <h6>Categorías</h6>
            <ul>
              {categories.map(category => (
                <li key={category.name}>
                  <Link to={`/products/${category.name}`} onClick={() => handleCategoryClick(category.name)}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted small"><Link to="/">Mostrar todas</Link></p>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;