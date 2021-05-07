import { AchievementCriterion } from './AchievementCriterion'

import { Criterion } from '@/types'
import { AchievementCriterionProgress } from './types'

export type AchievementCriteriaListProps = {
  criteria: Criterion[]
  criteriaProgress: Record<string, AchievementCriterionProgress>
}

export const AchievementCriteriaList: React.FC<AchievementCriteriaListProps> = ({
  criteria,
  criteriaProgress,
}) => {
  return (
    <div className="grid grid-cols-2 leading-8 text-foreground-muted font-bold text-sm">
      {criteria.map(({ id, description, showProgressBar }) => (
        <div key={id} className={showProgressBar && 'col-span-2'}>
          <AchievementCriterion
            description={description}
            {...criteriaProgress?.[id]}
          />
        </div>
      ))}
    </div>
  )
}
