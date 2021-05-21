import Link from 'next/link';

import { HeaderLogin } from '@/components/HeaderLogin';
import ThemeSwitch from '@/components/ThemeSwitch';

export const Header: React.FC = () => {
  return (
    <div className="p-5 flex w-full justify-between items-center">
      <div className="flex items-center">
        <ThemeSwitch />
        <div className="ml-4 space-x-4">
          <Link href="/character/eu/argent-dawn/razzelle">Razzelle</Link>
          <Link href="/character/us/kelthuzad/asmongold">Asmongold</Link>
        </div>
      </div>
      <HeaderLogin />
    </div>
  )
}
