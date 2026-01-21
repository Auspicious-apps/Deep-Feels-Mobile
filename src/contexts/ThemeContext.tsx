import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeColors, ThemeColors } from '../utils/Colors';
import STORAGE_KEYS from '../utils/Storage';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  colors: AppThemeColors;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: ThemeColors.light,
  setTheme: () => {},
  isDarkMode: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [theme, setThemeState] = useState<ThemeType>('light');

  // Load saved theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(
          STORAGE_KEYS.THEME_STORAGE_KEY,
        );
        if (
          savedTheme === 'light' ||
          savedTheme === 'dark' ||
          savedTheme === 'system'
        ) {
          setThemeState(savedTheme);
        } else {
          setThemeState('light'); // Default to light
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
        setThemeState('light');
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage and update state
  const setTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
    }
  }, []);

  // Determine if dark mode is active
  const isDarkMode = useMemo(() => {
    return theme === 'system' ? systemScheme === 'dark' : theme === 'dark';
  }, [theme, systemScheme]);

  // Select colors based on dark mode
  const colors = useMemo<AppThemeColors>(
    () => (isDarkMode ? ThemeColors.dark : ThemeColors.light),
    [isDarkMode],
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      theme,
      colors,
      setTheme,
      isDarkMode,
    }),
    [theme, colors, setTheme, isDarkMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
