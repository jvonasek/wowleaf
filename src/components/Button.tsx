import {
  forwardRef,
  ReactNode,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from 'react'
import cx from 'classnames'

const VARIANT_MAP = {
  primary: cx(
    'bg-accent hover:bg-accent-lighter active:bg-accent-darker text-on-accent'
  ),
  secondary: cx(
    'bg-accent-alt hover:bg-accent-alt-lighter active:bg-accent-alt-darker text-on-accent-alt'
  ),
  transparent: cx('text-foreground bg-transparent hover:underline'),
}

const SIZE_MAP = {
  small: cx('px-2.5 py-1.5 text-xs rounded'),
  medium: cx('py-2.5 px-5 text-sm rounded'),
  large: cx('py-4 px-7 text-sm rounded'),
}

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: keyof typeof VARIANT_MAP
  size?: keyof typeof SIZE_MAP
  children?: ReactNode
}

export const Button: React.FC<ButtonProps> = forwardRef(
  ({ children, variant = 'primary', size = 'medium', ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cx(
          'inline-flex items-center leading-4 font-bold uppercase whitespace-no-wrap',
          'focus:ring focus:ring-accent-alt-darker focus:outline-none',
          VARIANT_MAP[variant],
          SIZE_MAP[size]
        )}
      >
        {children}
      </button>
    )
  }
)
