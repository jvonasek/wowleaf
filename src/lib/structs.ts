import {
  enums,
  object,
  string,
  optional,
  array,
  intersection,
  nullable,
} from 'superstruct'

import { Faction, BNET_REGIONS } from './constants'

export const CharacterRouteStruct = object({
  region: enums(BNET_REGIONS),
  realm: string(),
  name: string(),
  category: optional(array(string())),
})

export const AchIndexApiRouteStruct = object({
  factionId: enums([Faction.Alliance, Faction.Horde]),
})

export const AchCategoryApiRouteStruct = object({
  category: array(string()),
  factionId: optional(enums([Faction.Alliance, Faction.Horde])),
})
