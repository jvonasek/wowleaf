import Link from 'next/link'

import { CharacterInfo } from '@/components/CharacterInfo'
import { CharacterAvatar } from '@/modules/character/CharacterAvatar'
import { Character } from '@/types'

export type CharacterCardProps = Character

export const CharacterCard: React.FC<CharacterCardProps> = (
  props
): JSX.Element => {
  const { region, name, level, raceId, classId, realm, realmSlug } = props
  return (
    <div className="flex space-x-2">
      <CharacterAvatar {...props} />
      <div className="min-w-0">
        <p className="text-lg font-bold leading-relaxed truncate">
          <Link href={`/character/${region}/${realmSlug}/${name}`}>{name}</Link>
        </p>
        <p className="text-sm">
          <CharacterInfo raceId={raceId} classId={classId} level={level} />
        </p>

        <p className="text-sm text-foreground-muted">{realm}</p>
      </div>
    </div>
  )
}
