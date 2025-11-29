import React, { createContext, ReactNode, useContext, useState } from 'react';

type Theme = 'default' | 'dark';

export const themes = {
  default: {
    primary: '#4f46e5', // Indigo-600
    background: '#f3f4f6', // Gray-100
    text: '#1f2937', // Gray-800
    card: '#ffffff',
    textLight: '#ffffff',
  },

  dark: {
    primary: '#6366f1', // Indigo-500
    background: '#111827', // Gray-900
    text: '#f3f4f6', // Gray-100
    card: '#1f2937', // Gray-800
    textLight: '#ffffff',
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof themes['default'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('default');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
