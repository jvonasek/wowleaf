import { useState, Fragment, ReactNode } from 'react'
import cx from 'classnames'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { noop } from '@/lib/utils'

import { Button } from '@/components/Button'

const SIZE_MAP = {
  small: 'max-w-md p-6 my-8',
  medium: 'max-w-xl p-8 my-8',
  large: 'max-w-3xl p-10 my-8',
}

export type DialogProps = {
  title: string
  description: string
  open: boolean
  size?: keyof typeof SIZE_MAP
  onClose: () => void
  children?: ReactNode
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  children,
  size = 'medium',
  open = false,
  onClose = noop,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  return (
    <Transition
      show={open}
      as={Fragment}
      beforeEnter={() => setIsOpen(true)}
      afterLeave={() => setIsOpen(false)}
    >
      <HeadlessDialog
        open={isOpen}
        onClose={onClose}
        static
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessDialog.Overlay className="fixed inset-0 transition-opacity backdrop-filter backdrop-blur">
              <div className="absolute inset-0 bg-background opacity-50" />
            </HeadlessDialog.Overlay>
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={cx(
                'inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-2xl',
                SIZE_MAP[size]
              )}
            >
              <HeadlessDialog.Title
                as="h3"
                className="text-lg text-foreground font-medium leading-6"
              >
                {title}
              </HeadlessDialog.Title>
              <HeadlessDialog.Description className="text-sm text-foreground-muted mt-2">
                {description}
              </HeadlessDialog.Description>

              <div className="mt-2">{children}</div>

              <div className="mt-4">
                <Button variant="secondary" size="large" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
