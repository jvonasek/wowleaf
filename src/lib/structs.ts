import { array, defaulted, enums, object, optional, string } from 'superstruct'

import { BNET_REGIONS, Faction } from './constants'

export const CharacterRouteStruct = object({
  region: enums(BNET_REGIONS),
  realm: string(),
  name: string(),
  category: defaulted(array(string()), []),
})

export const AchIndexApiRouteStruct = object({
  factionId: enums([Faction.Alliance, Faction.Horde]),
})

export const AchCategoryApiRouteStruct = object({
  factionId: optional(enums([Faction.Alliance, Faction.Horde])),
  category: defaulted(array(string()), []),
  id: optional(array(string())),
})
