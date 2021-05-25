import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'
import { AchievementCard } from '@/modules/achievement/AchievementCard'
import { Faction } from '@/types'

import { CharacterAchievementsFilter } from './CharacterAchievementsFilter'
import { usePaginatedAchievementsQuery } from './hooks/usePaginatedAchievementsQuery'

type CharacterAchievementsProps = {
  category?: string[]
  characterKey: string
  factionId: Faction
  isAggregated: boolean
}

export const CharacterAchievements: React.FC<CharacterAchievementsProps> = ({
  category,
  characterKey,
  factionId,
  isAggregated = false,
}) => {
  const {
    fetchNextPage,
    hasNextPage,
    paginator: { current, total, page, lastPage },
    data: achievements,
    isLoading: isAchsLoading,
    isSuccess: isAchsSuccess,
  } = usePaginatedAchievementsQuery(
    {
      category,
      characterKey,
      factionId,
    },
    {
      enabled: !!characterKey,
    }
  )

  const isLoading = isAchsLoading
  const isSuccess = isAchsSuccess

  useWowheadLinks({ refresh: isSuccess }, [achievements])

  return (
    <div>
      <CharacterAchievementsFilter />
      {isLoading ? <Spinner size="6" /> : ''}
      {!!achievements.length && (
        <span>
          Page {page} / {lastPage} (Showing {current} out of {total})
        </span>
      )}
      <div className="space-y-7">
        {isSuccess &&
          achievements.map((ach) => (
            <AchievementCard
              key={ach.id}
              {...ach}
              isProgressAggregated={isAggregated}
            />
          ))}
      </div>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()}>LOAD MORE</Button>
      )}
      {!!achievements.length && (
        <span>
          Page {page} / {lastPage} (Showing {current} out of {total})
        </span>
      )}
    </div>
  )
}
