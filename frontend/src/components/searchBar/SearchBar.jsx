import React from 'react';
import './searchBar.css'

const SearchBar = () => {
  return (
    <section>
      <div className="search-bar">
        <input type="text" placeholder="Buscar..." />
        <img
                alt=""
                src={process.env.PUBLIC_URL + '/assets/svg/navigation/search.svg'}
                width="28"
                height="21"
                className="d-inline-block align-top"
              />

      </div>
    </section>
  );
};

export default SearchBar;
