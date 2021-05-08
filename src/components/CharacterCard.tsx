import Link from 'next/link'

import { CharacterProps } from '@/types'
import { Button } from '@/components/Button'
import { DateTime } from '@/components/DateTime'

import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'

export type CharacterCardProps = {
  onClick: (realmSlug: string, name: string) => void
} & CharacterProps

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  level,
  raceId,
  guild,
  classId,
  onClick,
  realmSlug,
  updatedAt,
}): JSX.Element => (
  <div className="bg-surface p-3 rounded-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-lg font-bold">
          <Link href={`/character/eu/argent-dawn/${name}`}>{name}</Link>
        </p>
        {guild && <p className="text-sm">&lt;{guild}&gt;</p>}
      </div>

      {updatedAt && (
        <span className="text-xs text-on-background-muted">
          {<DateTime date={new Date(updatedAt)} relative />}
        </span>
      )}
    </div>
    <p className="text-sm">
      {CHARACTER_RACE_MAP[raceId]}{' '}
      <span className={`font-bold text-class-${classId}`}>
        {CHARACTER_CLASS_MAP[classId]}
      </span>{' '}
      Level {level}
    </p>
    {onClick && (
      <Button variant="secondary" onClick={() => onClick(realmSlug, name)}>
        ADD
      </Button>
    )}
  </div>
)
