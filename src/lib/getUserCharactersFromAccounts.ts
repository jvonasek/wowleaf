import { CharacterProps } from '@/types/index'

const getUserCharactersFromAccounts = (accounts: Array<any>): Array<CharacterProps> => {
  if (!accounts && !accounts.length) {
    return []
  }

  return accounts
    .reduce(
      (prev, curr) =>
        prev.concat(
          curr.characters.map(({ id, name, realm, level, faction, gender, playable_class, playable_race }) => ({
            id,
            name,
            realmId: realm.id,
            realmSlug: realm.slug,
            level,
            faction: faction.type,
            gender: gender.type,
            playableClass: playable_class.name,
            playableRace: playable_race.name,
          }))
        ),
      []
    )
    .sort((a: CharacterProps, b: CharacterProps) => b.level - a.level)
}

export default getUserCharactersFromAccounts
