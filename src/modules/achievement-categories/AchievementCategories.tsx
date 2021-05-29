import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import cx from 'classnames'
import { GlobeIcon } from '@heroicons/react/outline'

import { AchievementCategory } from '@/types'

export type AchievementCategoriesProps = {
  basePath: string
}

const colorMap = {
  0: ['text-white', '!bg-rose-500'],
  1: ['text-white', '!bg-pink-500'],
  2: ['text-white', '!bg-fuchsia-500'],
  3: ['text-white', '!bg-purple-500'],
  4: ['text-white', '!bg-violet-500'],
  5: ['text-white', '!bg-indigo-500'],
  6: ['text-white', '!bg-blue-500'],
  7: ['text-white', '!bg-lightBlue-500'],
  8: ['text-white', '!bg-cyan-500'],
  9: ['text-white', '!bg-teal-500'],
  10: ['text-white', '!bg-emerald-500'],
  11: ['text-white', '!bg-green-500'],
  12: ['text-white', '!bg-lime-500'],
  13: ['text-white', '!bg-yellow-500'],
  14: ['text-white', '!bg-amber-500'],
  15: ['text-white', '!bg-orange-500'],
  16: ['text-white', '!bg-red-500'],
}

const ActiveLink = ({ children, href, index }) => {
  const router = useRouter()
  const isActive = router.asPath === href
  const [text, bg] = colorMap[index] || []
  return (
    <Link href={href} passHref>
      <a
        className={cx(
          'flex items-center w-full rounded-xl hover:text-foreground hover:bg-surface',
          {
            [`${bg} ${text}`]: isActive,
            'text-foreground-muted': !isActive,
          }
        )}
      >
        <span
          className={`flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-xl ${bg}`}
        >
          <GlobeIcon className={`w-6 h-6 ${text}`} />
        </span>
        <span
          className={cx(
            'px-5 uppercase text-sm font-bold',
            'transition-all rounded-xl',
            'flex items-center w-full h-6'
          )}
        >
          {children}
        </span>
      </a>
    </Link>
  )
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = ({
  basePath,
}) => {
  const { isSuccess, data } = useQuery<AchievementCategory[]>(
    '/api/wow/categories/'
  )

  return (
    <div className="space-y-3 sticky top-7 border-surface">
      {isSuccess &&
        data.map(({ id, name, slug }, index) => (
          <div key={id}>
            <ActiveLink index={index} href={`${basePath}/achievements/${slug}`}>
              {name}
            </ActiveLink>
            {/* otherAchievementCategories.length > 0 &&
              otherAchievementCategories.map(({ id, name, slug }) => (
                <div key={id} className="pl-4 text-sm">
                  <ActiveLink href={`${basePath}/achievements/${slug}`}>
                    {name}
                  </ActiveLink>
                </div>
              )) */}
          </div>
        ))}
    </div>
  )
}
