import { useQuery } from 'react-query'
import Link from 'next/link'

import { useCharacterStore } from '@/modules/character/store/useCharacterStore'

export type AchievementCategoriesProps = {
  category?: string[]
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = () => {
  const { characterKey } = useCharacterStore()

  const { isSuccess, data } = useQuery(
    ['WoWAchievementCategories', 'index'],
    () => fetch('/api/wow/categories/').then((res) => res.json())
  )

  return (
    <div className="space-y-3">
      <input type="text" />
      {data && <strong>{data.name}</strong>}
      {isSuccess &&
        data.map(({ id, name, slug, otherAchievementCategories }) => (
          <div className="bg-surface p-3 rounded text-lg" key={id}>
            <Link href={`/character/${characterKey}/achievements/${slug}`}>
              {name}
            </Link>
            {otherAchievementCategories.length > 0 &&
              otherAchievementCategories.map(({ id, name, slug }) => (
                <div key={id} className="pl-4 text-sm">
                  <Link
                    href={`/character/${characterKey}/achievements/${slug}`}
                  >
                    {name}
                  </Link>
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}
