import { useQuery } from 'react-query'

import { CharacterCard } from '@/components/CharacterCard'

import { useCharacterStore } from './store/useCharacterStore'

export const CharacterPageHeader: React.FC = () => {
  const { region, realm, name } = useCharacterStore()
  const { isSuccess, data: character } = useQuery(
    'BnetCharacter',
    () =>
      fetch(`/api/bnet/character/${region}/${realm}/${name}`, {
        method: 'GET',
      }).then((res) => res.json()),
    { enabled: !!(region && realm && name) }
  )

  return <div>{isSuccess && <CharacterCard {...character} />}</div>
}