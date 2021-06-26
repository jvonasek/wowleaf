import cx from 'classnames'
import { Fragment, ReactNode, useCallback, useRef, useState } from 'react'

import { Button, ButtonProps } from '@/components/Button'
import { noop } from '@/lib/utils'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

const SIZE_MAP = {
  small: 'max-w-md p-6 my-8',
  medium: 'max-w-xl p-8 my-8',
  large: 'max-w-3xl p-8 my-8',
}

export type DialogProps = {
  title?: string
  description?: string
  open: boolean
  noContentPadding?: boolean
  size?: keyof typeof SIZE_MAP
  buttons?: Array<{ name: string } & ButtonProps>
  children?: ReactNode
  onClose: () => void
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  size = 'medium',
  open = false,
  noContentPadding = false,
  buttons = [],
  children,
  onClose = noop,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const ref = useRef(null)

  const scrollToTop = useCallback(() => {
    if (ref.current) {
      ref.current.scroll(0, 0)
    }
  }, [ref])

  return (
    <Transition
      show={open}
      as={Fragment}
      afterEnter={scrollToTop}
      beforeEnter={() => setIsOpen(true)}
      afterLeave={() => setIsOpen(false)}
    >
      <HeadlessDialog
        open={isOpen}
        onClose={onClose}
        static
        className="fixed inset-0 z-10"
      >
        <div className="fixed inset-0 overflow-y-auto" ref={ref}>
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
                <div className="absolute inset-0 bg-background opacity-30" />
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
                  'relative inline-block w-full text-left align-middle',
                  'bg-surface-1 dark:bg-tertiary-2 shadow-xl rounded-2xl',
                  'transition-all transform',
                  noContentPadding ? '!p-0' : '',
                  SIZE_MAP[size]
                )}
              >
                {title && (
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg text-foreground font-medium leading-6"
                  >
                    {title}
                  </HeadlessDialog.Title>
                )}
                {description && (
                  <HeadlessDialog.Description className="text-sm text-foreground-muted my-2">
                    {description}
                  </HeadlessDialog.Description>
                )}

                <div>{children}</div>

                {!!buttons.length && (
                  <div className="space-x-4 mt-4">
                    {buttons.map(({ name, ...props }) => (
                      <Button key={name} {...props} />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className={cx(
                    'absolute top-0 right-0',
                    'transform translate-x-1/4 -translate-y-1/4',
                    'flex items-center justify-center',
                    'bg-surface-1 text-foreground shadow dark:bg-tertiary-1',
                    'w-12 h-12 rounded-full',
                    'focus:outline-none hover:text-primary-2'
                  )}
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
