import React, { useState, useEffect } from 'react'; // Importa useState y useEffect desde React
import { GlobalProvider } from "./context/globalContext/GlobalContext";
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import NoPage from './pages/nopage/NoPage';
import About from './pages/about/About';
import Contact from './pages/contact/Contact'
import ProductDetails from './components/productDetails/ProductDetails';
import CrearCuenta from './components/crearCuenta/CrearCuenta';
import IniciarSesion from './components/iniciarSesion/IniciarSesion';
import NavBar from '../src/components/navbar/NavBar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importa BrowserRouter, Routes y Route desde react-router-dom
import { AuthProvider } from '../src/components/authContext/AuthContext';
import ProductForm from './components/productForm/ProductForm';
import Favorites from './components/favorites/Favorites';
import Popular from './components/popular/Popular';
import Arrived from './components/arrived/Arrived';
import FilteredProductsPage from './components/filteredProductsPage/FilteredProductsPage';
import MisReservas from './components/misReservas/MisReservas.jsx';
import PoliticasDeReserva from './components/politicasDeReserva/PoliticasDeReserva.jsx';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthProvider>
    <GlobalProvider>
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/registrar-producto" element={<ProductForm />} />
            <Route path="/products/:categoryName" element={<FilteredProductsPage />} />
            <Route path="/mis-reservas/:userId" element={<MisReservas />} />
            <Route path="/politicas-de-reserva" element={<PoliticasDeReserva/>} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            <Route path="/popular" element={<Popular />}/>
            <Route path="/arrived" element={<Arrived />}/>
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </GlobalProvider>
    </AuthProvider>
  );
};

export default App;