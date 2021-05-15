import { enums, object, string, optional, array } from 'superstruct'

import { BNET_REGIONS } from './constants'

export const CharacterRouteStruct = object({
  region: enums(BNET_REGIONS),
  realm: string(),
  name: string(),
  category: optional(array(string())),
})
