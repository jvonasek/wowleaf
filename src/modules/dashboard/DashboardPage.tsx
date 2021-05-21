import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'

const createCharacterKey = ({ region, realm, name }) =>
  `${region}/${realm}/${name}`.toLowerCase()

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
