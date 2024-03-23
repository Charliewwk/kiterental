import React, {useState} from "react";
import { Dropdown } from "react-bootstrap";
import { useGlobal } from "../../context/globalContext/GlobalContext";
import "./languageSelector.css";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children)}
        </ul>
      </div>
    );
  }
);

const LanguageSelector = () => {
  const { theme, language, languageDispatch } = useGlobal();

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Português" },
  ];

  const handleLanguageChange = (selectedLanguage) => {
    if (language.language !== selectedLanguage) {
      console.log("Lenguaje actual: ", selectedLanguage);
      languageDispatch({
        type: "TOGGLE_LANGUAGE",
        payload: selectedLanguage,
      });
    }
  };

  return (
    <div className="App">
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} className="custom-dropdown-toggle">
          <img
            className={`icon-globe ${theme.darkMode ? "invert-color" : ""}`}
            src={process.env.PUBLIC_URL + "/assets/svg/navbar/globe.svg"}
            alt="Language"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu} className="custom-dropdown-menu">
          {languages.map((lang) => (
            <Dropdown.Item
              key={lang.code}
              className={`${lang.code === language.language ? "disabled" : ""}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <img
                className="icon-flags"
                alt={lang.code}
                src={`${process.env.PUBLIC_URL}/assets/svg/language/${lang.code}.svg`}
              />
              {lang.label}
            </Dropdown.Item>
        ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSelector;
