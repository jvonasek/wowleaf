import { Story, Meta } from '@storybook/react'

import { Header, HeaderProps } from './'

export default {
  title: 'Layout/Header',
  component: Header,
} as Meta

const Template: Story<HeaderProps> = (args) => <Header {...args}>Header</Header>

export const Default = Template.bind({})
