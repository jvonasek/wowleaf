import { memo, useState } from 'react'

import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { Card } from '@/components/Card'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'
import { AchievementCard } from '@/modules/achievement/AchievementCard'
import { Faction } from '@/types'

import { CharacterAchievementsFilter } from './CharacterAchievementsFilter'
import { usePaginatedAchievementsQuery } from './hooks/usePaginatedAchievementsQuery'
import { useAchievementsFilterStore } from './store/useAchievementsFilterStore'

import { debounce } from 'debounce'

type CharacterAchievementsProps = {
  category?: string[]
  characterKey: string
  factionId: Faction
  isAggregated: boolean
}

const getInitialFilter = (state) => state.filter

export const CharacterAchievements: React.FC<CharacterAchievementsProps> = memo(
  ({ category, characterKey, factionId, isAggregated = false }) => {
    const initialFilter = useAchievementsFilterStore(getInitialFilter)
    const [filter, setFilter] = useState(initialFilter)

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
        filter,
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
        <CharacterAchievementsFilter onChange={debounce(setFilter, 1)} />
        {isLoading ? <Spinner size="6" /> : ''}
        {!!achievements.length && (
          <span>
            Page {page} / {lastPage} (Showing {current} out of {total})
          </span>
        )}
        <div className="space-y-7">
          {isSuccess &&
            !isLoading &&
            achievements.map((ach) => (
              <Card key={ach.id}>
                <AchievementCard {...ach} isProgressAggregated={isAggregated} />
              </Card>
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
)
