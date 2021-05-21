import { Button, ButtonProps } from '@/components/Button';
import { Meta, Story } from '@storybook/react';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta

const TheButton: Story<ButtonProps> = (args) => (
  <Button {...args}>Button</Button>
)

export const Default = TheButton.bind({})

export const Variants: Story = () => (
  <div className="space-x-4">
    <TheButton variant="primary" />
    <TheButton variant="secondary" />
  </div>
)

export const Sizes: Story = () => (
  <div className="space-x-4">
    <TheButton size="large" />
    <TheButton size="medium" />
    <TheButton size="small" />
  </div>
)
