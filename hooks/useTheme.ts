import { useAuth } from '../contexts/AuthContext';
import { useColorScheme } from './useColorScheme';

const colorThemes = [
  'default', 'red', 'blue', 'green', 'purple', 'orange', 'pink', 'teal',
] as const;
type ColorTheme = typeof colorThemes[number];

type ThemeColors = Record<ColorTheme, { light: string; dark: string }>;

const themeColors: ThemeColors = {
  default: {
    light: 'hsl(240, 10%, 3.9%)', // from global.css :root --foreground
    dark: 'hsl(0, 0%, 98%)', // from global.css .dark:root --foreground
  },
  red: {
    light: 'hsl(0, 72%, 51%)',
    dark: 'hsl(0, 72%, 51%)',
  },
  blue: {
    light: 'hsl(217, 91%, 60%)',
    dark: 'hsl(217, 91%, 60%)',
  },
  green: {
    light: 'hsl(142, 71%, 45%)',
    dark: 'hsl(142, 71%, 45%)',
  },
  purple: {
    light: 'hsl(280, 67%, 55%)',
    dark: 'hsl(280, 67%, 55%)',
  },
  orange: {
    light: 'hsl(24, 95%, 58%)',
    dark: 'hsl(24, 95%, 58%)',
  },
  pink: {
    light: 'hsl(330, 81%, 60%)',
    dark: 'hsl(330, 81%, 60%)',
  },
  teal: {
    light: 'hsl(180, 70%, 48%)',
    dark: 'hsl(180, 70%, 48%)',
  },
};

export function useTheme() {
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  let colorTheme = (user?.user_metadata?.colorTheme || 'default') as ColorTheme;
  if (!colorThemes.includes(colorTheme)) colorTheme = 'default';
  return {
    colorScheme: scheme,
    colorTheme,
    theme: themeColors[colorTheme][scheme],
  };
} 