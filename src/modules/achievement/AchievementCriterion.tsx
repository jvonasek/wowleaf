import { memo } from 'react'

import { ProgressBar } from '@/components/ProgressBar'
import { formatGold } from '@/lib/formatGold'
import { CharacterAchievementCriterionProgress } from '@/modules/character/types'

export type AchievementCriterionProps = {
  isGold: boolean
  description: string
} & CharacterAchievementCriterionProgress

export const AchievementCriterion: React.FC<AchievementCriterionProps> = memo(
  ({
    description,
    showProgressBar,
    isCompleted,
    partial,
    required,
    isGold,
  }) => {
    return (
      <span>
        {description && (
          <span
            className={isCompleted ? 'text-positive' : 'text-foreground-muted'}
          >
            {description}
          </span>
        )}
        {showProgressBar && (
          <ProgressBar
            value={partial}
            total={required}
            display="values"
            formatter={isGold ? formatGold : undefined}
          />
        )}
      </span>
    )
  }
)
