import { ProgressBar } from '@/components/ProgressBar'

import { CriterionWithProgress } from '@/types'

export type AchievementCriterionProps = CriterionWithProgress

export const AchievementCriterion: React.FC<AchievementCriterionProps> = ({
  description,
  showProgressBar,
  totalAmount,
  partialAmount,
  isCompleted,
}) => (
  <div>
    <span className={isCompleted ? 'text-positive' : 'opacity-50'}>
      {description}
    </span>
    {showProgressBar && (
      <ProgressBar total={totalAmount} value={partialAmount} />
    )}
  </div>
)
