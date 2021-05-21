import { BattleNetRegion } from '@/types';

type CharacterParams = {
  region: BattleNetRegion
  realmSlug: string
  name: string
}

export const createCharacterKey = ({
  region,
  realmSlug,
  name,
}: CharacterParams): string => {
  if (region && realmSlug && name) {
    return `${region}/${realmSlug}/${name}`.toLowerCase()
  }

  return ''
}
