import { HeaderLogin } from '@/components/HeaderLogin'
import ThemeSwitch from '@/components/ThemeSwitch'

export type HeaderProps = void

export const Header: React.FC = () => {
  return (
    <div className="p-5 flex w-full justify-between items-center">
      <div>
        <ThemeSwitch />
      </div>
      <HeaderLogin />
    </div>
  )
}
