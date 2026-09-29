import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";


type Theme = "light" | "dark";


interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextValue | null>(null);


interface ThemeProviderProps {
  children: ReactNode;
}


export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "theme",
    "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme(): void {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      "useTheme doit être utilisé dans ThemeProvider.",
    );
  }

  return context;
}