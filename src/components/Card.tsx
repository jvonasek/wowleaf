import { ReactNode } from 'react'

export type CardProps = {
  title?: string
  children?: ReactNode
}

export const Card: React.FC<CardProps> = ({ children, title }) => (
  <div className="bg-surface rounded-lg shadow-lg">
    {title && (
      <div className="border-b border-background px-7 py-3 text-sm">
        {title}
      </div>
    )}
    <div className="p-7">{children}</div>
  </div>
)
