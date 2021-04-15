import { Achievement } from '@/types'

export type AchievementCardProps = Achievement

export const AchievementCard: React.FC<AchievementCardProps> = ({
  id,
  name,
  description,
  isCompleted,
}) => (
  <div>
    [{id}]{' '}
    {isCompleted && <span className="font-bold text-positive">COMPLETED</span>}{' '}
    {name} <br />
    {description}
  </div>
)
