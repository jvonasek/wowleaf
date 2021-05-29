import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsExclamation } from 'react-icons/bs'
import {
  GiAnvil,
  GiBarbute,
  GiBeastEye,
  GiBeerStein,
  GiBookmarklet,
  GiPointyHat,
  GiCherish,
  GiCrossedSwords,
  GiExplodingPlanet,
  GiMailedFist,
  GiSnail,
  GiKnapsack,
} from 'react-icons/gi'
import { useQuery } from 'react-query'

import { AchievementCategory } from '@/types'

export type AchievementCategoriesProps = {
  basePath: string
}

const LINK_ICON_COLOR_MAP = {
  0: ['text-purple-300', '!bg-purple-500', GiBarbute],
  1: ['text-violet-300', '!bg-violet-500', BsExclamation],
  2: ['text-indigo-300', '!bg-indigo-500', GiKnapsack],
  3: ['text-blue-300', '!bg-blue-500', GiCrossedSwords],
  4: ['text-lightBlue-300', '!bg-lightBlue-500', GiBeastEye],
  5: ['text-cyan-300', '!bg-cyan-500', GiAnvil],
  6: ['text-teal-300', '!bg-teal-500', GiCherish],
  7: ['text-emerald-300', '!bg-emerald-500', GiBeerStein],
  8: ['text-green-300', '!bg-green-500', GiSnail],
  9: ['text-lime-300', '!bg-lime-500', GiPointyHat],
  10: ['text-yellow-300', '!bg-yellow-500', GiExplodingPlanet],
  11: ['text-amber-300', '!bg-amber-500', GiMailedFist],
  12: ['text-orange-300', '!bg-orange-500', GiBookmarklet],
}

const ActiveLink = ({ children, href, index }) => {
  const router = useRouter()
  const isActive = router.asPath === href
  const [text, bg, Icon] = LINK_ICON_COLOR_MAP[index] || []
  return (
    <Link href={href} passHref>
      <a
        className={cx(
          'flex items-center w-full rounded-xl hover:text-foreground hover:bg-surface',
          {
            [`bg-surface text-foreground`]: isActive,
            'text-foreground-muted': !isActive,
          }
        )}
      >
        <span
          className={`flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-xl ${bg} !bg-opacity-10`}
        >
          <Icon className={`${text} ${index === 1 ? 'w-9 h-9' : 'w-6 h-6'}`} />
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
