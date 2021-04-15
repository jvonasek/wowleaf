import { ReactNode, ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
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
  small: cx('px-2 py-1 text-xs'),
  medium: cx('py-2 px-5 text-sm'),
  large: cx('py-3 px-6 text-sm'),
}

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: keyof typeof VARIANT_MAP
  size?: keyof typeof SIZE_MAP
  children?: ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center leading-4 rounded font-bold uppercase whitespace-no-wrap',
        VARIANT_MAP[variant],
        SIZE_MAP[size]
      )}
    >
      {children}
    </button>
  )
}
