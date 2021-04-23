import { Story, Meta } from '@storybook/react'

import { ProgressBar, ProgressBarProps } from '@/components/ProgressBar'

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: {
      control: {
        type: 'range',
        options: [0, 100, 1],
      },
    },
    total: {
      control: {
        type: 'range',
        options: [0, 100, 1],
      },
    },
  },
} as Meta

const TheProgressBar: Story<ProgressBarProps> = (args) => (
  <ProgressBar {...args} />
)

export const Default = TheProgressBar.bind({})
Default.args = {
  value: 50,
}

export const Multiple: Story = () => (
  <div className="space-y-4">
    <TheProgressBar value={0} />
    <TheProgressBar value={50} />
    <TheProgressBar value={100} />
  </div>
)
