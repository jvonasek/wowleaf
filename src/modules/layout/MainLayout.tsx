import Link from 'next/link'
import Head from 'next/head'

import { Container } from '@/components/Container'
import { Header } from '@/components/Header'

export type MainLayoutProps = {
  children?: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <>
    <Head>
      <script>{`const whTooltips = {colorLinks: true, iconizeLinks: false, renameLinks: true, iconSize: true}`}</script>
      <script src="https://wow.zamimg.com/widgets/power.js"></script>
    </Head>
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
  </>
)
