import Link from 'next/link'

import { CharacterProps } from '@/types'
import { Button } from '@/components/Button'

import { CharacterAvatar } from '@/modules/character/CharacterAvatar'

import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'

export type CharacterCardProps = {
  onClick?: (realmSlug: string, name: string) => void
} & CharacterProps

export const CharacterCard: React.FC<CharacterCardProps> = ({
  region,
  name,
  level,
  raceId,
  guild,
  classId,
  onClick,
  realmSlug,
  gender,
}): JSX.Element => (
  <div className="bg-surface p-3 rounded-lg flex space-x-2">
    <CharacterAvatar
      region={region}
      realmSlug={realmSlug}
      name={name}
      gender={gender}
      raceId={raceId}
    />
    <div>
      <div>
        <p className="text-lg font-bold">
          <Link href={`/character/eu/argent-dawn/${name}`}>{name}</Link>
        </p>
        {guild && <p className="text-sm">&lt;{guild}&gt;</p>}
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
  </div>
)
