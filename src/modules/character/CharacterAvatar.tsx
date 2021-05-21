import { Spinner } from '@/components/Spinner';
import { Gender } from '@/types';

import { useCharacterMediaQuery } from './hooks/useCharacterMediaQuery';
import { CharacterParams } from './types';

export type CharacterAvatarProps = CharacterParams & {
  gender?: Gender
  raceId?: number
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  region,
  realmSlug,
  name,
  gender,
  raceId,
}) => {
  const isReady = !!(region && realmSlug && name)
  const { isLoading, isSuccess, avatar } = useCharacterMediaQuery(
    {
      region,
      realmSlug,
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
