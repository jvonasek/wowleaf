import { Spinner } from '@/components/Spinner'

import { useCharacterMediaQuery } from './hooks/useCharacterMediaQuery'
import { Character } from '@/types'

export type CharacterAvatarProps = Character

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
    <div className="inline-block w-[84px] h-[84px] flex-shrink-0">
      <span className="w-full h-full border-2 bg-background p-0.5 rounded-xl border-secondary-3 flex items-center justify-center">
        {isLoading && <Spinner />}
        {isSuccess && avatar && (
          <img
            src={avatar}
            width={84}
            height={84}
            className="block rounded-lg"
          />
        )}
      </span>
    </div>
  )
}
