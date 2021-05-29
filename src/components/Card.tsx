import { ReactNode } from 'react'
import cx from 'classnames'

export type CardProps = {
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  variant?: 'tertiary' | 'surface'
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'surface',
}) => (
  <div
    className={cx(
      'rounded-lg shadow',
      variant === 'tertiary' ? 'bg-tertiary-2 text-on-tertiary' : 'bg-surface-1'
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
