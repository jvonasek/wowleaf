import { memo } from 'react'
import { ProgressBar } from '@/components/ProgressBar'

import { CharacterAchievementCriterionProgress } from '@/modules/character/types'

export type AchievementCriterionProps = {
  description: string
} & CharacterAchievementCriterionProgress

export const AchievementCriterion: React.FC<AchievementCriterionProps> = memo(
  ({ description, showProgressBar, isCompleted, partial, required }) => {
    return (
      <span>
        {description && (
          <span
            className={isCompleted ? 'text-positive' : 'text-foreground-muted'}
          >
            {description}
          </span>
        )}
        {showProgressBar && <ProgressBar value={partial} total={required} />}
      </span>
    )
  }
)
