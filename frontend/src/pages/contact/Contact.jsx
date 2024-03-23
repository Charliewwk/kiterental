import React, { useState } from "react";
import { useGlobal } from "../../context/globalContext/GlobalContext";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { translations } = useGlobal();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError(translations.contactPage.verifyMessage);
      console.log(
        "Error en los datos cargados!: ",
        translations.contactPage.verifyMessage
      );
      setSuccessMessage("");
    } else {
      setIsSubmitting(true);
      setSuccessMessage(
        translations.contactPage.successMessage.replace(
          "${formData.fullName}",
          formData.fullName
        )
      );
      console.log(
        "Formulario enviado exitosamente!: ",
        translations.contactPage.successMessage.replace(
          "${formData.fullName}",
          formData.fullName
        )
      );
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
          fullName: "",
          email: "",
        });
        setSuccessMessage("");
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="card card-limit">
        <div className="card-header">{translations.contact}</div>
        <div className="card-body card-body d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-3">
              <label className="form-label" htmlFor="fullName">
                {translations.contactPage.fullname}
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
                {translations.contactPage.fullnameHelp}
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                {translations.contactPage.email}
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
                {translations.contactPage.emailHelp}
              </small>
            </div>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? translations.contactPage.sending : translations.contactPage.sendButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
