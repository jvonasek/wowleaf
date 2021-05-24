import { HeaderLogin } from '@/components/HeaderLogin'
import ThemeSwitch from '@/components/ThemeSwitch'

export const Header: React.FC = () => {
  return (
    <div className="p-5 flex w-full justify-between items-center">
      <ThemeSwitch />

      <HeaderLogin />
    </div>
  )
}
