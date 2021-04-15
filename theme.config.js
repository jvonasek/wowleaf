const { Theme, ThemeManager } = require('tailwindcss-theming/api')

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
  transparent: 'transparent',
}

const palette = {
  default: {
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
    background: '#ffffff',
    foreground: {
      DEFAULT: '#272727',
      muted: '#757575',
    },
    surface: '#f2f5fa',
    'accent-alt': {
      lighter: colors.accent1,
      DEFAULT: colors.accent2,
      darker: colors.accent3,
    },
    'on-accent-alt': colors.accent5,
  },
  dark: {
    background: '#0b0e11',
    foreground: {
      DEFAULT: '#dee3ea',
      muted: '#5d7290',
    },
    surface: '#151a21',
    'accent-alt': {
      lighter: colors.accent7,
      DEFAULT: colors.accent8,
      darker: colors.accent9,
    },
    'on-accent-alt': colors.white,
  },
}

const light = new Theme().addColors({
  ...palette.default,
  ...palette.light,
})

const dark = new Theme().addColors({
  ...palette.default,
  ...palette.dark,
})

module.exports = new ThemeManager()
  .setDefaultTheme(light.targetable())
  .setDefaultLightTheme(light.setName('light').targetable())
  .setDefaultDarkTheme(dark.setName('dark').targetable())