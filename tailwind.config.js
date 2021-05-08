const themeSwapper = require('tailwindcss-theme-swapper')

const colors = {
  // Light Accent
  accent1: '#f2faff',
  accent2: '#ecf7ff',
  accent3: '#d9eeff',

  // Default Accent
  accent4: '#33a9ff',
  accent5: '#0090f7',
  accent6: '#0171c3',

  // Dark Accent
  accent7: '#214263',
  accent8: '#152a40',
  accent9: '#102132',

  // Reaction Positive
  positive1: '#35df90',
  positive2: '#1eb871',
  positive3: '#188e57',
  positive4: '#0a3d25',

  // Reaction Negative
  negative1: '#f47961',
  negative2: '#ea4f30',
  negative3: '#d52f0f',
  negative4: '#380e06',

  // Reaction Neutral
  neutral1: '#fac661',
  neutral2: '#f0ae2d',
  neutral3: '#e19607',
  neutral4: '#4c3505',

  // other
  white: '#ffffff',
  black: '#000000',
}

const createTheme = (theme) => {
  const palette = {
    default: {
      white: colors.white,
      black: colors.black,
      class: {
        1: '#C79C6E',
        2: '#F58CBA',
        3: '#ABD473',
        4: '#FFF569',
        5: theme === 'base' ? '#000000' : '#FFFFFF',
        6: '#C41F3B',
        7: '#0070DE',
        8: '#69CCF0',
        9: '#9482C9',
        10: '#00FF96',
        11: '#FF7D0A',
        12: '#A330C9',
      },
      accent: {
        lighter: colors.accent4,
        DEFAULT: colors.accent5,
        darker: colors.accent6,
      },
      'on-accent': colors.white,
      positive: {
        lighter: colors.positive1,
        DEFAULT: colors.positive2,
        darker: colors.positive3,
      },
      'on-positive': colors.positive4,
      negative: {
        lighter: colors.negative1,
        DEFAULT: colors.negative2,
        darker: colors.negative3,
      },
      'on-negative': colors.negative4,
      neutral: {
        lighter: colors.neutral1,
        DEFAULT: colors.neutral2,
        darker: colors.neutral3,
      },
      'on-neutral': colors.neutral4,
    },
    light: {
      background: '#f2f5fa',
      foreground: {
        DEFAULT: '#272727',
        muted: '#757575',
      },
      surface: '#ffffff',
      'accent-alt': {
        lighter: colors.accent1,
        DEFAULT: colors.accent2,
        darker: colors.accent3,
      },
      'on-accent-alt': colors.accent5,
    },
    dark: {
      background: '#151a21',
      foreground: {
        DEFAULT: '#dee3ea',
        muted: '#a8b7cc',
      },
      surface: '#0b0e11',
      'accent-alt': {
        lighter: colors.accent7,
        DEFAULT: colors.accent8,
        darker: colors.accent9,
      },
      'on-accent-alt': colors.white,
    },
  }

  return theme === 'base'
    ? {
        ...palette.default,
        ...palette.light,
      }
    : {
        ...palette.default,
        ...palette.dark,
      }
}

const themeSwapperConfig = {
  themes: [
    {
      name: 'base',
      selectors: [':root'],
      theme: {
        colors: {
          ...createTheme('base'),
        },
      },
    },
    {
      name: 'dark',
      selectors: ['.dark'],
      theme: {
        colors: {
          ...createTheme('dark'),
        },
      },
    },
  ],
}

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
      ],
      mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
    },
  },
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/styles/safelist.txt',
  ],
  plugins: [require('@tailwindcss/forms'), themeSwapper(themeSwapperConfig)],
}
