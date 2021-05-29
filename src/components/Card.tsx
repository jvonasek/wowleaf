import { ReactNode } from 'react'
import cx from 'classnames'

export type CardProps = {
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  variant?: 'dark' | 'default'
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
}) => (
  <div
    className={cx(
      'rounded-lg shadow-lg',
      variant === 'dark' ? 'bg-background-darker' : 'bg-surface'
    )}
  >
    {header && (
      <div className="border-b border-background px-6 py-3 text-sm">
        {header}
      </div>
    )}
    <div className="p-6">{children}</div>
    {footer && (
      <div className="border-t border-background px-6 py-3 text-sm">
        {footer}
      </div>
    )}
  </div>
)
