import { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode : boolean;     // Indique si le mode sombre est activé
  toggleTheme: () => void;  // Fonction qui inverse l'état
}

// Création d'un contexte pour gérer l'état du thème
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


interface ThemeProviderProps {
  children: ReactNode;
};

export function ThemeProvider({ children } : ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

// Charger le thème précédement sélectionné par l'utilisateur depuis le localStorage
  useEffect(() => {
   const savedTheme = localStorage.getItem('isDarkMode');
   if (savedTheme !== null) {
    setIsDarkMode(JSON.parse(savedTheme));
   }
  }, []);

// Sauvegarder le thème dans le localStorage à chaque fois qu'il change
  useEffect(()=> {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
};



// Hook personnalisé pour que les composants qui utilisent le contexte du thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

