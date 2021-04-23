import { useState } from 'react'
import { Story, Meta } from '@storybook/react'

import { Dialog, DialogProps } from '@/components/Dialog'
import { Button } from '@/components/Button'

export default {
  title: 'Components/Dialog',
  component: Dialog,
} as Meta

const TheDialog: Story<DialogProps> = (args) => <Dialog {...args} />

export const Default: Story = () => {
  const [open, setOpen] = useState(true)
  const [size, setSize] = useState<DialogProps['size']>('small')

  const sizes: DialogProps['size'][] = ['small', 'medium', 'large']

  function closeDialog() {
    setOpen(false)
  }

  function openDialog(size) {
    setSize(size)
    setOpen(true)
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-accent-alt-lighter to-accent-alt-darker">
      <Button
        size="large"
        variant="secondary"
        onClick={() => openDialog('medium')}
      >
        Open dialog
      </Button>
      <TheDialog
        open={open}
        onClose={closeDialog}
        size={size}
        title="Payment successful"
        description="Your payment has been successfully submitted. We’ve sent your an email with all of the details of your order."
        buttons={sizes.map((size) => ({
          name: size,
          children: size,
          onClick: () => setSize(size),
        }))}
      ></TheDialog>
    </div>
  )
}
