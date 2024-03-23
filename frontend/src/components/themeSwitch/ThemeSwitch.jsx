import React from "react";
import { Button } from 'react-bootstrap';
import { useGlobal } from "../../context/globalContext/GlobalContext";

const ThemeSwitch = () => {
  const { theme, themeDispatch } = useGlobal();

  const toggleTheme = () => {
    console.log('Tema actual ',theme.darkMode ? "Light" : "Dark");
    themeDispatch({ type: "TOGGLE_THEME" });
    const htmlElement = document.documentElement;
    htmlElement.setAttribute(
      "data-bs-theme",
      theme.darkMode ? "light" : "dark"
    );
  };

  return (
      <img
        onClick={toggleTheme}
        src={theme.darkMode ? "/assets/svg/navbar/sun.svg" : "/assets/svg/navbar/moon.svg"}
        alt="Theme"
      />

  );
};

export default ThemeSwitch;
