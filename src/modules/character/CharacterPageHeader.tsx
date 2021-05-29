import { CharacterAvatar } from '@/modules/character/CharacterAvatar'
import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'

import { useCharacterStore } from './store/useCharacterStore'

export const CharacterPageHeader: React.FC = () => {
  const character = useCharacterStore()
  const { name, classId, raceId, guild, realm, region } = character

  return (
    <div className="flex">
      <CharacterAvatar {...character} />
      <div className="ml-4 flex items-center">
        <div>
          <h1 className="font-bold text-4xl">{name}</h1>
          <span>
            <span>{CHARACTER_RACE_MAP[raceId]}</span>{' '}
            <span className={`font-bold text-class-${classId}`}>
              {CHARACTER_CLASS_MAP[classId]}
            </span>
            <span className="text-foreground-muted">
              {guild && <span> &lt;{guild}&gt;</span>}
              <span>
                {' '}
                {realm} {region?.toUpperCase()}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
