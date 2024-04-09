import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";



const themeActions = {
  TOGGLE_THEME: "TOGGLE_THEME",
};

const favoriteActions = {
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",
  SET_FAVORITES_FROM_LOCAL_STORAGE: "SET_FAVORITES_FROM_LOCAL_STORAGE",
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
      const { id, title } = action.payload;
      const existingIndex = state.findIndex((user) => user.id === id);
      let updatedFavorites = [];

      if (existingIndex !== -1) {
        // Si el producto ya está en favoritos, eliminarlo
        updatedFavorites = state.filter((user) => user.id !== id);
      } else {
        // Si el producto no está en favoritos, agregarlo
        updatedFavorites = [...state, { id, title }];
      }

      // Actualizar el estado y el localStorage
      localStorage.setItem("favoriteUsers", JSON.stringify(updatedFavorites));
      return updatedFavorites;

    case favoriteActions.SET_FAVORITES_FROM_LOCAL_STORAGE:
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteUsers")
      );
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
  

  useEffect(() => {
    favoriteDispatch({
      type: favoriteActions.SET_FAVORITES_FROM_LOCAL_STORAGE,
    });
  }, []);

 



  return (
    <GlobalContext.Provider
      value={{
        theme,
        themeDispatch,
        favoriteUsers,
        favoriteDispatch,

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
