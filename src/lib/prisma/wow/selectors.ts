import { Faction } from '@/types'

export const createFactionSelector = (factionId: Faction) => {
  if (!factionId) {
    return {}
  }
  return {
    OR: [
      {
        factionId,
      },
      {
        factionId: null,
      },
    ],
  }
}
