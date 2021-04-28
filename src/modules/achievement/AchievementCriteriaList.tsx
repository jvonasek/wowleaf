import { ProgressBar } from '@/components/ProgressBar'
import { Criterion } from '@/types'

export type AchievementCriteriaListProps = {
  criteria: Criterion[]
}

export const AchievementCriteriaList: React.FC<AchievementCriteriaListProps> = ({
  criteria,
  criteriaProgress,
}) => {
  return (
    <div className="grid grid-cols-2 leading-8 text-foreground-muted font-bold text-sm">
      {criteria.map(({ id, description, amount, showProgressBar }) => (
        <div key={id} className={showProgressBar && 'col-span-2'}>
          {description && (
            <span
              className={
                criteriaProgress?.[id].isCompleted ? 'text-positive' : ''
              }
            >
              {description}
            </span>
          )}
          {showProgressBar && <ProgressBar value={0} total={amount} />}
        </div>
      ))}
    </div>
  )
}
