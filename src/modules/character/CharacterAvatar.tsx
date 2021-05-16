import { useCharacterMediaQuery } from './hooks/useCharacterMediaQuery'

import { Spinner } from '@/components/Spinner'

import { CharacterParams } from './types'
import { CharacterGender } from '@/types'

export type CharacterAvatarProps = CharacterParams & {
  gender?: CharacterGender
  raceId?: number
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  region,
  realm,
  name,
  gender,
  raceId,
}) => {
  const isReady = !!(region && realm && name)
  const { isLoading, isSuccess, avatar } = useCharacterMediaQuery(
    {
      region,
      realm,
      name,
      gender,
      raceId,
    },
    {
      enabled: isReady,
    }
  )

  return (
    <div className="inline-block w-20 h-20">
      {isLoading && <Spinner />}
      {isSuccess && avatar && <img src={avatar} className="rounded-lg" />}
    </div>
  )
}
