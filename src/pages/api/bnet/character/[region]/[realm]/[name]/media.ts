import { NextApiHandler } from 'next'
import {
  WoWAPI,
  BattleNetResponse,
  LocalizedCharacterMedia,
  BattleNetRegion,
} from 'battlenet-api'
import ms from 'ms.macro'

import cacheAPI from '@/lib/cacheAPI'
import getCachedAccessToken from '@/lib/getCachedAccessToken'
import { normalizeBattleNetData } from '@/lib/normalizeBattleNetData'

type CharacterMediaResponse = BattleNetResponse<LocalizedCharacterMedia>

const handle: NextApiHandler = (req, res) => {
  return cacheAPI<CharacterMediaResponse>(req, res, {
    key: req.url,
    expiration: ms('1 day'),
    method: async (req) => {
      const { region, realm, name } = req.query as {
        region: BattleNetRegion
        realm: string
        name: string
      }

      const accessToken = await getCachedAccessToken()
      const wow = new WoWAPI({
        debug: true,
        accessToken,
        region: region,
      })

      return await wow.getCharacterMedia(realm, name)
    },
    callback: async (result) => {
      if (result.error) return []

      return normalizeBattleNetData('characterMedia')(result.data)
    },
  })
}

export default handle
