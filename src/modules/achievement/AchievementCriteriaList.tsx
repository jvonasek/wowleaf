import { CharacterAchievementCriterionProgress } from '@/modules/character/types'
import { Criterion } from '@/types'

import { AchievementCard } from './AchievementCard'
import { AchievementCriterion } from './AchievementCriterion'

export type AchievementCriteriaListProps = {
  criteria: Criterion[]
  criteriaProgress: Record<string, CharacterAchievementCriterionProgress>
  isProgressAggregated: boolean
}

export const AchievementCriteriaList: React.FC<AchievementCriteriaListProps> = ({
  criteria,
  criteriaProgress,
  isProgressAggregated,
}) => {
  return (
    <div className="grid grid-cols-2 leading-8 text-foreground-muted font-bold text-sm">
      {criteria.map(({ id, description, linkedAchievement, isGold }) => (
        <div
          key={id}
          className={
            criteriaProgress?.[id]?.showProgressBar || !!linkedAchievement
              ? 'col-span-2'
              : ''
          }
        >
          {linkedAchievement ? (
            <AchievementCard
              {...linkedAchievement}
              isProgressAggregated={isProgressAggregated}
            />
          ) : (
            <AchievementCriterion
              description={description}
              isGold={isGold}
              {...criteriaProgress?.[id]}
            />
          )}
        </div>
      ))}
    </div>
  )
}
