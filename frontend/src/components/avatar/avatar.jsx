import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate desde react-router-dom
import './avatar.css';
import ProductForm from '../productForm/ProductForm';
import ActualizarPerfil from '../actualizarPerfil/ActualizarPerfil';
import DeleteForm from '../deleteForm/DeleteForm';

function Avatar({ onLogout }) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showActualizarPerfil, setShowActualizarPerfil] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const navigate = useNavigate();

  const avatarStyle = {
    backgroundColor: 'blue',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
  };

  
  const handleMisReservas = () => {
    const userId = localStorage.getItem('userId'); 
    navigate(`/mis-reservas/${userId}`); 
  };

  return (
    <div className="avatar-container" style={avatarStyle}>
      <Dropdown>
        <Dropdown.Toggle variant="transparent" id="dropdown-avatar">
          <FontAwesomeIcon icon={faUser} className="user-icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowProductForm(true)} className="nav-link">
            Registrar Producto
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowActualizarPerfil(true)} className="nav-link">
            Actualizar Perfil
          </Dropdown.Item>
          <Dropdown.Item onClick={handleMisReservas} className="nav-link"> 
            Mis reservas
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteForm(true)} className="nav-link">
            Eliminar Cuenta
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {showProductForm && <ProductForm show={true} handleClose={() => setShowProductForm(false)} />}
      {showActualizarPerfil && <ActualizarPerfil show={true} handleClose={() => setShowActualizarPerfil(false)} />}
      {showDeleteForm && <DeleteForm show={true} handleClose={() => setShowDeleteForm(false)} onLogout={onLogout} />}
    </div>
  );
}

export default Avatar;