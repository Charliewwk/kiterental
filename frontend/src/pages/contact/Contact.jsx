import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleFocus = () => {
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[^\s]+(\s[^\s]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !nameRegex.test(formData.fullName) ||
      formData.fullName.length <= 5 ||
      !emailRegex.test(formData.email)
    ) {
      setError("Por favor, ingrese un nombre válido y una dirección de correo electrónico válida.");
      setSuccessMessage("");
    } else {
      setIsSubmitting(true);
      setSuccessMessage(`¡Gracias ${formData.fullName}! Su formulario ha sido enviado exitosamente.`);
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
          fullName: "",
          email: "",
        });
        setSuccessMessage("");
        setError("");
        navigate('/');
      }, 5000);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="card card-limit">
        <div className="card-header">Contacto</div>
        <div className="card-body card-body d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-3">
              <label className="form-label" htmlFor="fullName">
                Nombre completo
              </label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onFocus={handleFocus}
                aria-describedby="nameHelpBlock"
              />
              <small id="nameHelpBlock" className="form-text text-muted">
                Ingrese su nombre completo.
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleFocus}
                aria-describedby="emailHelpBlock"
              />
              <small id="emailHelpBlock" className="form-text text-muted">
                Ingrese su dirección de correo electrónico.
              </small>
            </div>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;