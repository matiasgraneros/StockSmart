import { useContext } from 'react';
import { ThemeContext, ThemeContextProps } from './themeContext';

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }
  return context;
};
