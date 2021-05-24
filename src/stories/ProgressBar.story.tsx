import { ProgressBar, ProgressBarProps } from '@/components/ProgressBar'
import { Meta, Story } from '@storybook/react'

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
  <div className="bg-surface p-5">
    <ProgressBar {...args} />
  </div>
)

export const Default = TheProgressBar.bind({})
Default.args = {
  label: 'Progress',
  value: 50,
}

export const Multiple: Story = () => (
  <div>
    <TheProgressBar label="Progress" value={0} />
    <TheProgressBar label="Progress" value={50} />
    <TheProgressBar label="Progress" value={100} />
  </div>
)
