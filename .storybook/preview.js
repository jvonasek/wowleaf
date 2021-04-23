import '../src/styles/base.css'
import { addDecorator } from '@storybook/react'
import { withRootAttribute } from 'storybook-addon-root-attribute'

addDecorator(withRootAttribute)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    disable: true,
  },
  rootAttribute: {
    tooltip: true,
    defaultState: {
      name: 'Light',
      value: 'light',
    },
    states: [
      {
        name: 'Dark',
        value: 'dark',
      },
    ],
  },
}
