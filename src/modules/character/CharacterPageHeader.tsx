import { CharacterCard } from '@/components/CharacterCard';

import { useCharacterStore } from './store/useCharacterStore';

export const CharacterPageHeader: React.FC = () => {
  const character = useCharacterStore()

  return (
    <div>
      <CharacterCard {...character} />
    </div>
  )
}
