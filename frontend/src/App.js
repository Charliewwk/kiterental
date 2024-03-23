import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from "./context/globalContext/GlobalContext";
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import NoPage from './pages/nopage/NoPage';
import About from './pages/about/About';
import Contact from './pages/contact/Contact'
import ProductDetails from './components/productDetails/ProductDetails';
import SignUp from './components/signup/SignUp';
import SignIn from './components/signin/SignIn';

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />  
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

export default App;
