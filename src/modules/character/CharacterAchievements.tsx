import { memo, useMemo, useState } from 'react'

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
      paginator: { current, total, page, lastPage, isLoadingNext },
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

    const pageInfo = useMemo(() => {
      if (achievements.length) {
        return (
          <span>
            Page {page} / {lastPage} (Showing {current} out of {total})
          </span>
        )
      }
    }, [achievements.length, current, lastPage, page, total])

    const isLoading = isAchsLoading
    const isSuccess = isAchsSuccess

    useWowheadLinks({ refresh: isSuccess }, [achievements])

    console.log({
      isLoading,
      isSuccess,
    })

    return (
      <div>
        <div className="mb-9 relative">
          <Card
            footer={
              pageInfo && (
                <span className="text-foreground-muted">{pageInfo}</span>
              )
            }
          >
            <CharacterAchievementsFilter onChange={debounce(setFilter, 1)} />
          </Card>
        </div>
        {isLoading ? <Spinner /> : ''}
        <div className="space-y-7">
          {isSuccess &&
            !isLoading &&
            achievements.map((ach) => (
              <Card key={ach.id}>
                <AchievementCard {...ach} isProgressAggregated={isAggregated} />
              </Card>
            ))}
        </div>
        <div className="text-center mt-7">
          {hasNextPage && (
            <Button
              size="large"
              isLoading={isLoadingNext}
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          )}
          {pageInfo && (
            <span className="block mt-4 text-xs text-foreground-muted">
              {pageInfo}
            </span>
          )}
        </div>
      </div>
    )
  }
)
