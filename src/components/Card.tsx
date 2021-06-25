import { ReactNode } from 'react'

export type CardProps = {
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export const Card: React.FC<CardProps> = ({ children, header, footer }) => (
  <div className="rounded-lg shadow bg-surface-1">
    {header && (
      <div className="border-b border-surface-2 px-6 py-3 text-sm">
        {header}
      </div>
    )}
    <div className="p-6">{children}</div>
    {footer && (
      <div className="border-t border-surface-2 px-6 py-3 text-sm">
        {footer}
      </div>
    )}
  </div>
)
