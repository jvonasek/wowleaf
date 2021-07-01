const themeSwapper = require('tailwindcss-theme-swapper')
const tailwindColors = require('tailwindcss/colors')

const colors = {
  textLight: '#2a2d34',
  textLightMuted: '#6f6e7b',

  textDark: '#fbfbf9',
  textDarkMuted: '#9295a4',

  bgLight: '#eaedf2',
  bgDark: '#14151a',

  // Primary Accent
  primary1: '#5581fc',
  primary2: '#406ff3',
  primary3: '#365ed2',

  // Reaction Positive
  positive1: '#61d17d',
  positive2: '#4dcb6d',
  positive3: '#39c65c',

  // Reaction Neutral
  neutral1: '#d1c661',
  neutral2: '#cbbf4d',
  neutral3: '#c6b839',

  // Reaction Negative
  negative1: '#d16161',
  negative2: '#cb4d4d',
  negative3: '#c63939',

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
      brand: {
        battlenet: '#0074e0',
      },
      primary: {
        1: colors.primary1,
        2: colors.primary2,
        3: colors.primary3,
      },
      'on-primary': colors.white,
      tertiary: {
        1: '#100f14',
        2: '#0c0c12',
        3: '#060609',
      },
      'on-tertiary': colors.white,
      positive: {
        lighter: colors.positive1,
        DEFAULT: colors.positive2,
        darker: colors.positive3,
      },
      'on-positive': colors.white,
      negative: {
        lighter: colors.negative1,
        DEFAULT: colors.negative2,
        darker: colors.negative3,
      },
      'on-negative': colors.white,
      neutral: {
        lighter: colors.neutral1,
        DEFAULT: colors.neutral2,
        darker: colors.neutral3,
      },
      'on-neutral': colors.white,
    },
    light: {
      background: colors.bgLight,
      foreground: {
        DEFAULT: colors.textLight,
        muted: colors.textLightMuted,
      },
      surface: {
        1: '#ffffff',
        2: '#e0e0e8',
      },
      secondary: {
        1: '#e6e8ee',
        2: '#dee1e8',
        3: '#d7dbe3',
      },
      'on-secondary': colors.textLight,
    },
    dark: {
      background: colors.bgDark,
      foreground: {
        DEFAULT: colors.textDark,
        muted: colors.textDarkMuted,
      },
      surface: {
        1: '#1c1c24',
        2: '#262630',
      },
      secondary: {
        1: '#373645',
        2: '#2e2d3b',
        3: '#252431',
      },
      'on-secondary': colors.textDark,
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
          ...tailwindColors,
          ...createTheme('base'),
        },
      },
    },
    {
      name: 'dark',
      selectors: ['.dark'],
      theme: {
        colors: {
          ...tailwindColors,
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
    extend: {
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        'out-back': 'cubic-bezier(0.34, 1.30, 0.70, 1)',
      },
      animation: {
        'pulse-subtle':
          'pulse-subtle 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '50%': {
            opacity: '.7',
          },
        },
      },
    },
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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    themeSwapper(themeSwapperConfig),
  ],
}
