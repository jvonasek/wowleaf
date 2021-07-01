import { BattleNetResponse, WoWAPI } from 'battlenet-api'
import ms from 'ms.macro'
import { NextApiHandler } from 'next'

import cacheAPI from '@/lib/cacheAPI'
import { CharacterRouteStruct } from '@/lib/structs'
import getCachedAccessToken from '@/lib/getCachedAccessToken'
import { normalizeBattleNetData } from '@/lib/normalizeBattleNetData'

const handle: NextApiHandler = (req, res) =>
  cacheAPI<BattleNetResponse>(req, res, {
    key: req.url,
    expiration: ms('1 hour'),
    method: async (req) => {
      const { region, realm, name } = CharacterRouteStruct.create(req.query)
      const accessToken = await getCachedAccessToken()
      const wow = new WoWAPI({
        debug: true,
        accessToken,
        region,
      })
      return await wow.getCharacterAchievements(realm, name)
    },
    callback: (result) => {
      if (result.error) return result

      return normalizeBattleNetData('characterAchievements')(result.data)
    },
  })

export default handle
