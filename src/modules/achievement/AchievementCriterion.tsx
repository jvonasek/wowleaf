import { ProgressBar } from '@/components/ProgressBar'

import { CharacterAchievementCriterionProgress } from '@/modules/character/types'

import { useAchievementsStore } from './store/useAchievementsStore'

import { AchievementCard } from './AchievementCard'

export type AchievementCriterionProps = {
  description: string
} & CharacterAchievementCriterionProgress

export const AchievementCriterion: React.FC<AchievementCriterionProps> = ({
  id,
  description,
  showProgressBar,
  isCompleted,
  partial,
  required,
  linkedAchievementId,
}) => {
  const { get } = useAchievementsStore()
  const innerAchievement = get(linkedAchievementId)
  console.log(innerAchievement)
  return (
    <span>
      {description && (
        <span
          className={isCompleted ? 'text-positive' : 'text-foreground-muted'}
        >
          {description}
        </span>
      )}
      {innerAchievement && <AchievementCard {...innerAchievement} />}
      {showProgressBar && <ProgressBar value={partial} total={required} />}
    </span>
  )
}
