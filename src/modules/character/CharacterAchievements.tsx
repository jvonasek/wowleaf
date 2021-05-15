import { useCallback, useEffect, useState } from 'react'
import { AchievementCard } from '@/modules/achievement/AchievementCard'
import { CharacterAchievementsFilter } from './CharacterAchievementsFilter'

import { Spinner } from '@/components/Spinner'

import { useCharacterAchievementsStore } from './store/useCharacterAchievementsStore'
import { useCharacterStore } from './store/useCharacterStore'
import { useCharacterAchievementsQuery } from './hooks/useCharacterAchievementsQuery'
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'

import { useWowheadLinks } from '@/hooks/useWowheadLinks'

export const CharacterAchievements: React.FC = () => {
  const [achIds, setAchIds] = useState([])

  const { region, realm, name, characterKey } = useCharacterStore()
  const {
    get,
    isLoading: isAchsLoading,
    isSuccess: isAchsSuccess,
  } = useAchievementsStore()

  const {
    isLoading: isCharAchsLoading,
    isSuccess: isCharAchsSuccess,
  } = useCharacterAchievementsQuery([{ region, realm, name, characterKey }], {
    enabled: !!characterKey,
  })

  const isLoading = isAchsLoading || isCharAchsLoading
  const isSuccess = isAchsSuccess && isCharAchsSuccess

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

  useEffect(() => {
    if (isLoading) {
      setAchIds([])
    }

    if (isSuccess) {
      setAchIds(ids)
    }
  }, [ids, isLoading, isSuccess])

  useWowheadLinks({ refresh: isSuccess }, [achIds])

  return (
    <div>
      <CharacterAchievementsFilter />
      {isLoading && <Spinner size="6" />}
      {isSuccess && <span>Achievements: {achIds.length}</span>}
      <div className="space-y-7">
        {isSuccess &&
          achIds.map((id) => <AchievementCard key={id} {...get(id)} />)}
      </div>
    </div>
  )
}
