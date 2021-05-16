import { useQuery } from 'react-query'

import { CharacterCard } from '@/components/CharacterCard'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterProps } from '@/types'

export const CharacterPageHeader: React.FC = () => {
  const { region, realm, name } = useCharacterStore()
  const isReady = !!(region && realm && name)

  const characterParams = {
    region,
    realm,
    name,
  }

  const { isSuccess, data: character } = useQuery<CharacterProps>(
    ['BnetCharacter', characterParams],
    () =>
      fetch(`/api/bnet/character/${region}/${realm}/${name}`, {
        method: 'GET',
      }).then((res) => res.json()),
    { enabled: isReady }
  )

  return (
    <div>
      <input type="text" />
      {isSuccess && <CharacterCard region={region} {...character} />}
    </div>
  )
}
