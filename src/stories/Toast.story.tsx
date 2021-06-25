import { Toast, ToastProps } from '@/components/Toast'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Components/Toast',
  component: Toast,
} as Meta

const TheToast: Story<ToastProps> = (args) => <Toast {...args} />

export const Default = TheToast.bind({})
Default.args = {
  id: 'aaa',
  content: 'Would you like a toast with ham and cheese?',
  type: 'info',
}
