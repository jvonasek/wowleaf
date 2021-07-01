import { memo, useMemo, useState } from 'react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'
import { AchievementCard } from '@/modules/achievement/AchievementCard'
import { AchievementCardPlaceholder } from '@/modules/placeholder/AchievementCardPlaceholder'
import { TextRow } from '@/modules/placeholder/TextRow'
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

export const CharacterAchievements: React.FC<CharacterAchievementsProps> = memo(
  ({ category, characterKey, factionId, isAggregated = false }) => {
    const initialFilter = useAchievementsFilterStore((state) => state.filter)
    const [filter, setFilter] = useState(initialFilter)

    const {
      fetchNextPage,
      paginator: {
        current,
        total,
        overall,
        page,
        perPage,
        lastPage,
        hasNextPage,
        isLoadingNext,
      },
      data: achievements,
      isLoading,
      isSuccess,
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
        const hidden = overall > total ? overall - total : 0
        return (
          <span className="flex justify-between">
            <span>
              Page {page} / {lastPage} (Showing {current} out of {total})
            </span>
            {hidden > 0 && <span className="italic">{hidden} hidden</span>}
          </span>
        )
      }

      return <span>No achievements found.</span>
    }, [achievements.length, current, lastPage, overall, page, total])

    useWowheadLinks({ refresh: isSuccess }, [achievements])

    return (
      <div>
        <div className="mb-9 relative">
          <Card
            footer={
              isSuccess ? (
                <span className="text-foreground-muted">{pageInfo}</span>
              ) : (
                <TextRow className="max-w-xs" />
              )
            }
          >
            <CharacterAchievementsFilter onChange={debounce(setFilter, 1)} />
          </Card>
        </div>
        <div className="space-y-7">
          <AchievementCardPlaceholder
            ready={!isLoading && isSuccess}
            count={perPage}
          >
            {achievements.map((ach) => (
              <Card key={ach.id}>
                <AchievementCard {...ach} isProgressAggregated={isAggregated} />
              </Card>
            ))}
          </AchievementCardPlaceholder>
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
          {isSuccess && (
            <span className="block mt-4 text-xs text-foreground-muted">
              {pageInfo}
            </span>
          )}
        </div>
      </div>
    )
  }
)
