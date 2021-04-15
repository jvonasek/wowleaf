import Link from 'next/link'

import { Container } from '@/components/Container'
import { Header } from '@/components/Header'

export type LayoutPrimaryProps = {
  children?: React.ReactNode
}

export const LayoutPrimary: React.FC<LayoutPrimaryProps> = ({ children }) => (
  <div className="relative">
    <div className="flex">
      <div className="sticky top-0 w-64 h-screen p-5 bg-surface">
        <h2 className="font-bold text-lg mb-5">FUNCRAFT</h2>
        <Link href="/">
          <a className="block mb-2">Home</a>
        </Link>
        <Link href="/settings">
          <a className="block mb-2">Settings</a>
        </Link>
        <Link href="/palette">
          <a className="block mb-2">Palette</a>
        </Link>
        <Link href="/typography">
          <a className="block mb-2">Typography</a>
        </Link>
      </div>
      <div className="w-full px-5">
        <Header />
        <Container>{children}</Container>
      </div>
    </div>
  </div>
)
