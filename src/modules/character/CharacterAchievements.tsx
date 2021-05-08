import { useCallback } from 'react'
import { AchievementCard } from '@/modules/achievement/AchievementCard'

import { useCharacterAchievementsStore } from './store/useCharacterAchievementsStore'
import { useCharacterStore } from './store/useCharacterStore'
import { useCharacterAchievementsQuery } from './hooks/useCharacterAchievementsQuery'
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'

import { useWowheadLinks } from '@/hooks/useWowheadLinks'

export const CharacterAchievements: React.FC = () => {
  const { region, realm, name, characterKey } = useCharacterStore()
  const { get } = useAchievementsStore()
  const { ids } = useCharacterAchievementsStore(
    useCallback(
      (state) =>
        state[characterKey] || {
          ids: [],
          byId: {},
        },
      [characterKey]
    )
  )

  const { isSuccess } = useCharacterAchievementsQuery(
    [{ region, realm, name, characterKey }],
    {
      enabled: !!characterKey,
    }
  )

  useWowheadLinks({ refresh: isSuccess && !!ids.length })

  return (
    <div className="space-y-7">
      {isSuccess && ids.map((id) => <AchievementCard key={id} {...get(id)} />)}
    </div>
  )
}
