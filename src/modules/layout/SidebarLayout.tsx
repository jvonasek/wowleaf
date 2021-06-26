import { ReactNode } from 'react'

export type SidebarLayoutProps = {
  sidebar: ReactNode
  children: ReactNode
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  children,
}) => (
  <div className="grid grid-cols-12 gap-12">
    <div className="col-span-12 xl:col-span-3">{sidebar}</div>
    <div className="col-span-12 xl:col-span-9">{children}</div>
  </div>
)
