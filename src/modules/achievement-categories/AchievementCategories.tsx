import cx from 'classnames'
import { useRouter } from 'next/router'
import { BsExclamation } from 'react-icons/bs'
import {
  GiAnvil,
  GiBarbute,
  GiBeastEye,
  GiBeerStein,
  GiBookmarklet,
  GiCherish,
  GiCrossedSwords,
  GiExplodingPlanet,
  GiKnapsack,
  GiMailedFist,
  GiPointyHat,
  GiSnail,
} from 'react-icons/gi'
import { useQuery } from 'react-query'

import { ActiveLink } from '@/components/ActiveLink'
import { useCharacterAchievementsStore } from '@/modules/character/store/useCharacterAchievementsStore'
import { AchievementCategory } from '@/types'
import { percentage, getHslColorByPercent } from '@/lib/utils'

export type AchievementCategoriesProps = {
  basePath: string
  characterKey: string
}

const LINK_ICON_COLOR_MAP = {
  character: ['text-purple-500 dark:text-purple-300', '!bg-purple-500'],
  quests: ['text-violet-500 dark:text-violet-300', '!bg-violet-500'],
  exploration: ['text-indigo-500 dark:text-indigo-300', '!bg-indigo-500'],
  'player-vs-player': ['text-blue-500 dark:text-blue-300', '!bg-blue-500'],
  'dungeons-raids': ['text-sky-500 dark:text-sky-300', '!bg-sky-500'],
  professions: ['text-cyan-500 dark:text-cyan-300', '!bg-cyan-500'],
  reputation: ['text-teal-500 dark:text-teal-300', '!bg-teal-500'],
  'world-events': ['text-emerald-500 dark:text-emerald-300', '!bg-emerald-500'],
  'pet-battles': ['text-green-500 dark:text-green-300', '!bg-green-500'],
  collections: ['text-lime-500 dark:text-lime-300', '!bg-lime-500'],
  'expansion-features': [
    'text-yellow-500 dark:text-yellow-300',
    '!bg-yellow-500',
  ],
  'feats-of-strength': ['text-amber-500 dark:text-amber-300', '!bg-amber-500'],
  legacy: ['text-orange-500 dark:text-orange-300', '!bg-orange-500'],
}

const LINK_ICONS_MAP = {
  character: GiBarbute,
  quests: BsExclamation,
  exploration: GiKnapsack,
  'player-vs-player': GiCrossedSwords,
  'dungeons-raids': GiBeastEye,
  professions: GiAnvil,
  reputation: GiCherish,
  'world-events': GiBeerStein,
  'pet-battles': GiSnail,
  collections: GiPointyHat,
  'expansion-features': GiExplodingPlanet,
  'feats-of-strength': GiMailedFist,
  legacy: GiBookmarklet,
}

const CategoryLink = ({
  children,
  slug,
  currentQuantity,
  totalQuantity,
  nestedCategories,
  basePath,
}: {
  slug: string
  children: React.ReactNode
  currentQuantity: number
  totalQuantity: number
  nestedCategories: any[]
  basePath: string
}) => {
  const router = useRouter()
  const href = `${basePath}/achievements/${slug}`
  const isMainCategoryActive = router.asPath.startsWith(href)
  const [text, bg] = LINK_ICON_COLOR_MAP[slug] || []
  const Icon = LINK_ICONS_MAP[slug] || ''
  const percent = percentage(currentQuantity, totalQuantity, 0)
  return (
    <>
      <ActiveLink href={`${basePath}/achievements/${slug}`}>
        {(isActive) => (
          <a
            className={cx(
              'flex items-center w-full rounded-xl text-sm hover:text-foreground hover:bg-surface-1',
              {
                [`bg-surface-1 text-foreground`]: isActive,
              }
            )}
          >
            <span
              className={`flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-xl ${bg} !bg-opacity-10`}
            >
              <Icon
                className={`${text} ${
                  slug === 'quests' ? 'w-9 h-9' : 'w-6 h-6'
                }`}
              />
            </span>
            <span
              className={cx(
                'px-5 font-semibold',
                'transition-all rounded-xl',
                'flex items-center w-full h-6'
              )}
            >
              {children}
            </span>
            <span
              className="pr-5"
              style={{ color: getHslColorByPercent(percent) }}
            >
              {percent}%
            </span>
          </a>
        )}
      </ActiveLink>
      {isMainCategoryActive &&
        nestedCategories.length > 0 &&
        nestedCategories.map(({ id, name, slug }) => (
          <div key={id} className="text-sm">
            <ActiveLink href={`${basePath}/achievements/${slug}`}>
              {(isActive) => (
                <a
                  className={cx(
                    'py-1 block',
                    isActive ? 'text-foreground' : 'text-foreground-muted'
                  )}
                >
                  {name}
                </a>
              )}
            </ActiveLink>
          </div>
        ))}
    </>
  )
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = ({
  basePath,
  characterKey,
}) => {
  const { isSuccess, data } = useQuery<AchievementCategory[]>(
    '/api/wow/categories/'
  )

  const { getCharAchievements } = useCharacterAchievementsStore()
  const { categories } = getCharAchievements(characterKey)

  return (
    <div className="space-y-3 sticky top-7 border-surface-1">
      {isSuccess &&
        data.map(
          ({
            id,
            name,
            slug,
            allianceQuantity,
            hordeQuantity,
            otherAchievementCategories,
          }) => (
            <div key={id}>
              <CategoryLink
                basePath={basePath}
                currentQuantity={categories[id]?.quantity}
                totalQuantity={allianceQuantity}
                slug={slug}
                nestedCategories={otherAchievementCategories}
              >
                {name}
              </CategoryLink>
            </div>
          )
        )}
    </div>
  )
}
