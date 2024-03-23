import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";

const languageActions = {
  TOGGLE_LANGUAGE: "TOGGLE_LANGUAGE",
};

const themeActions = {
  TOGGLE_THEME: "TOGGLE_THEME",
};

const favoriteActions = {
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",
  SET_FAVORITES_FROM_LOCAL_STORAGE: "SET_FAVORITES_FROM_LOCAL_STORAGE",
};

const languageReducer = (state, action) => {
  switch (action.type) {
    case languageActions.TOGGLE_LANGUAGE:
      localStorage.setItem("language", action.payload);
      return { language: action.payload };
    default:
      return state;
  }
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case themeActions.TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
      return { darkMode: newDarkMode };
    default:
      return state;
  }
};

const favoriteReducer = (state, action) => {
  switch (action.type) {
    case favoriteActions.TOGGLE_FAVORITE:
      const user = action.payload;
      const favoriteUsers = state || [];
      const existingIndex = favoriteUsers.findIndex((u) => u.id === user.id);
      if (existingIndex !== -1) {
        favoriteUsers.splice(existingIndex, 1);
      } else {
        favoriteUsers.push(user);
      }
      localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
      return [...favoriteUsers];
    case favoriteActions.SET_FAVORITES_FROM_LOCAL_STORAGE:
      const storedFavorites = JSON.parse(localStorage.getItem("favoriteUsers"));
      return storedFavorites || [];
    default:
      return state;
  }
};

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const storedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  const [theme, themeDispatch] = useReducer(themeReducer, {
    darkMode: storedDarkMode,
  });
  const [favoriteUsers, favoriteDispatch] = useReducer(favoriteReducer, []);
  const storedLanguage = localStorage.getItem("language") || "en";
  const [language, languageDispatch] = useReducer(languageReducer, {
    language: storedLanguage,
  });
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    favoriteDispatch({
      type: favoriteActions.SET_FAVORITES_FROM_LOCAL_STORAGE,
    });
  }, []);

  useEffect(() => {
    const loadLanguageFile = async () => {
      const languageFile = await import(`../../locales/${language.language}.json`);
      setTranslations(languageFile);
    };

    loadLanguageFile();
  }, [language.language]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        themeDispatch,
        favoriteUsers,
        favoriteDispatch,
        language,
        languageDispatch,
        translations,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
