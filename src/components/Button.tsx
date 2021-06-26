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
    'bg-primary-2 hover:bg-primary-1 active:bg-primary-3 text-on-primary focus:ring-primary-1'
  ),
  secondary: cx(
    'bg-secondary-2 hover:bg-secondary-1 active:bg-secondary-3 text-on-secondary focus:ring-secondary-1'
  ),
  tertiary: cx(
    'bg-tertiary-2 hover:bg-tertiary-1 active:bg-tertiary-3 text-on-tertiary focus:ring-tertiary-1'
  ),
  positive: cx(
    'bg-positive hover:bg-positive-lighter active:bg-positive-darker text-on-positive focus:ring-positive-lighter'
  ),
  neutral: cx(
    'bg-neutral hover:bg-neutral-lighter active:bg-neutral-darker text-on-neutral focus:ring-neutral-lighter'
  ),
  negative: cx(
    'bg-negative hover:bg-negative-lighter active:bg-negative-darker text-on-negative focus:ring-negative-lighter'
  ),
  battlenet: cx(
    'bg-brand-battlenet text-white hover:brightness-105 active:bg-brand-battlenet/80'
  ),
  transparent: cx('text-foreground bg-transparent hover:underline'),
}

const SIZE_MAP = {
  small: cx('px-2.5 py-1.5 text-xs rounded'),
  medium: cx('py-2.5 px-5 leading-5 text-sm rounded'),
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
            'relative inline-flex items-center justify-center font-bold uppercase',
            'transition-colors leading-4 tracking-wide whitespace-no-wrap',
            'focus:ring-2 focus:ring-inset focus:outline-none',
            VARIANT_MAP[variant],
            SIZE_MAP[size],
            className
          )}
        >
          <span
            className={`transition-opacity duration-100 flex items-center ${
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
