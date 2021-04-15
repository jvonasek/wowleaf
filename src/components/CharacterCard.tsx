import { CharacterProps } from '@/types'
import { Button } from '@/components/Button'
import { DateTime } from '@/components/DateTime'

export type CharacterCardProps = {
  className?: string
  onClick: (realmSlug: string, name: string) => void
} & CharacterProps

export const CharacterCard: React.FC<CharacterCardProps> = ({
  className,
  name,
  level,
  playableRace,
  playableClass,
  onClick,
  realmSlug,
  lastLogin,
  createdAt,
  updatedAt,
}): JSX.Element => (
  <div className="bg-surface p-3 rounded-md">
    <div className="flex justify-between items-center">
      <p className="text-lg font-bold">{name}</p>
      {updatedAt && (
        <span className="text-xs text-on-background-muted">
          {<DateTime date={updatedAt} relative />}
        </span>
      )}
    </div>
    <p>
      {playableRace} {playableClass} Level {level}
    </p>
    {onClick && <Button onClick={() => onClick(realmSlug, name)}>ADD</Button>}
  </div>
)
