import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; // Ajusta la ruta de importación según la ubicación de tu AuthContext

const PrivateRoute = ({ element, ...props }) => {
  const { isLoggedIn } = useContext(AuthContext); // Ajusta el contexto según tu implementación

  return isLoggedIn ? <Route {...props} element={element} /> : <Navigate to="/login" />;
};

export default PrivateRoute;