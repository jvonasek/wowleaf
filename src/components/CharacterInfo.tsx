import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'

import { Character } from '@/types'

export type CharacterInfoProps = Pick<Character, 'raceId' | 'classId' | 'level'>

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
  raceId,
  classId,
  level,
}) => {
  const charRace = CHARACTER_RACE_MAP[raceId]
  const charClass = CHARACTER_CLASS_MAP[classId]
  return (
    <>
      {charRace}{' '}
      <span className={`font-bold text-class-${classId}`}>{charClass}</span>{' '}
      {level && <>Level {level}</>}
    </>
  )
}
