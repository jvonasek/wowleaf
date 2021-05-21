import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'

import { createCharacterKey } from '@/lib/createCharacterKey'

export const DashboardPage: React.FC = ({ characters }) => {
  const characterList = characters.map(({ name }) => {
    const character = {
      name,
      region: 'eu',
      realmSlug: 'argent-dawn',
    }
    return {
      ...character,
      characterKey: createCharacterKey(character),
    }
  })

  useCharacterAchievementsQuery(characterList, {
    enabled: !!characterList.length,
  })
  return 'dash'
}
