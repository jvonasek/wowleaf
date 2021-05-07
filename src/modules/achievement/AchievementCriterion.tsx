import { ProgressBar } from '@/components/ProgressBar'

import { AchievementCriterionProgress } from './types'

export type AchievementCriterionProps = {
  description: string
} & AchievementCriterionProgress

export const AchievementCriterion: React.FC<AchievementCriterionProps> = ({
  description,
  showProgressBar,
  isCompleted,
  partial,
  required,
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
      {showProgressBar && <ProgressBar value={partial} total={required} />}
    </span>
  )
}
