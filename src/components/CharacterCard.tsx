import Link from 'next/link'

import { Button } from '@/components/Button'
import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'
import { CharacterAvatar } from '@/modules/character/CharacterAvatar'
import { Character } from '@/types'

export type CharacterCardProps = {
  onClick?: (realmSlug: string, name: string) => void
} & Character

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
  <div className="flex space-x-2">
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
          <Link href={`/character/${region}/${realmSlug}/${name}`}>{name}</Link>
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
