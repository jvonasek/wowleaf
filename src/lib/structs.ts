import {
  enums,
  object,
  string,
  optional,
  array,
  defaulted,
  coerce,
  number,
} from 'superstruct'

import { Faction, BNET_REGIONS } from './constants'

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
