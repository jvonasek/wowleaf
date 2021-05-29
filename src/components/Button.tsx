import { Fragment } from 'react'
import cx from 'classnames'
import { Transition } from '@headlessui/react'
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  memo,
  ReactNode,
} from 'react'

import { Spinner } from '@/components/Spinner'

const VARIANT_MAP = {
  primary: cx(
    'bg-accent hover:bg-accent-darker active:bg-accent-lighter text-on-accent focus:ring-accent-lighter'
  ),
  secondary: cx(
    'bg-accent-alt hover:bg-accent-alt-darker active:bg-accent-alt-lighter text-on-accent-alt focus:ring-accent-alt-lighter'
  ),
  positive: cx(
    'bg-positive hover:bg-positive-darker active:bg-positive-lighter text-on-positive focus:ring-positive-lighter'
  ),
  neutral: cx(
    'bg-neutral hover:bg-neutral-darker active:bg-neutral-lighter text-on-neutral focus:ring-neutral-lighter'
  ),
  negative: cx(
    'bg-negative hover:bg-negative-darker active:bg-negative-lighter text-on-negative focus:ring-negative-lighter'
  ),
  transparent: cx('text-foreground bg-transparent hover:underline'),
}

const SIZE_MAP = {
  small: cx('px-2.5 py-1.5 text-xs rounded'),
  medium: cx('py-2.5 px-5 text-sm rounded'),
  large: cx('py-4 px-7 text-sm rounded'),
}

export type ButtonVariant = keyof typeof VARIANT_MAP
export type ButtonSize = keyof typeof SIZE_MAP

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = memo(
  forwardRef(
    (
      {
        children,
        variant = 'primary',
        size = 'medium',
        isLoading = false,
        className,
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          {...props}
          className={cx(
            'relative inline-flex items-center justify-center leading-4 font-bold uppercase whitespace-no-wrap',
            'focus:ring-2 focus:outline-none',
            VARIANT_MAP[variant],
            SIZE_MAP[size],
            className
          )}
        >
          <span
            className={`transition-opacity duration-100 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {children}
          </span>

          <Transition
            show={isLoading}
            as={Fragment}
            enter="transition duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <span className="block absolute inset-0">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Spinner size={size} />
              </span>
            </span>
          </Transition>
        </button>
      )
    }
  )
)
