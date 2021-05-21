import { AchievementCriterion } from './AchievementCriterion'

import { Criterion } from '@/types'
import { CharacterAchievementCriterionProgress } from '@/modules/character/types'

import { AchievementCard } from './AchievementCard'

export type AchievementCriteriaListProps = {
  criteria: Criterion[]
  criteriaProgress: Record<string, CharacterAchievementCriterionProgress>
}

export const AchievementCriteriaList: React.FC<AchievementCriteriaListProps> = ({
  criteria,
  criteriaProgress,
}) => {
  return (
    <div className="grid grid-cols-2 leading-8 text-foreground-muted font-bold text-sm">
      {criteria.map(({ id, description, linkedAchievement }) => (
        <div
          key={id}
          className={
            criteriaProgress?.[id]?.showProgressBar || !!linkedAchievement
              ? 'col-span-2'
              : ''
          }
        >
          {linkedAchievement ? (
            <AchievementCard {...linkedAchievement} />
          ) : (
            <AchievementCriterion
              description={description}
              {...criteriaProgress?.[id]}
            />
          )}
        </div>
      ))}
    </div>
  )
}
