import { Story, Meta } from '@storybook/react'

import { Button, ButtonProps } from './'

export default {
  title: 'Components/Button',
  component: Button,
} as Meta

const Template: Story<ButtonProps> = (args) => <Button {...args}>Button</Button>

export const Fill = Template.bind({})
Fill.args = {
  variant: 'fill',
  size: 'default',
  disabled: false,
  rounded: false,
}

export const Outline = Template.bind({})
Outline.args = {
  variant: 'outline',
  size: 'default',
  disabled: false,
  rounded: false,
}

export const Ghost = Template.bind({})
Ghost.args = {
  variant: 'ghost',
  size: 'default',
  disabled: false,
  rounded: false,
}
