import { CharacterProps } from '@/types'
import { Button } from '@/components/Button'
import { DateTime } from '@/components/DateTime'

export type CharacterCardProps = {
  onClick: (realmSlug: string, name: string) => void
} & CharacterProps

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  level,
  race,
  guildName,
  characterClass,
  onClick,
  realm,
  updatedAt,
}): JSX.Element => (
  <div className="bg-surface p-3 rounded-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-lg font-bold">{name}</p>
        {guildName && <p className="text-sm">&lt;{guildName}&gt;</p>}
      </div>

      {updatedAt && (
        <span className="text-xs text-on-background-muted">
          {<DateTime date={new Date(updatedAt)} relative />}
        </span>
      )}
    </div>
    <p className="text-sm">
      {race} {characterClass} Level {level}
    </p>
    {onClick && <Button onClick={() => onClick(realm.slug, name)}>ADD</Button>}
  </div>
)
