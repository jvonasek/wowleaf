import { NextApiHandler } from 'next'
import { WoWAPI, BattleNetResponse, UserProfile } from 'battlenet-api'
import ms from 'ms.macro'

import { normalizeBattleNetData } from '@/lib/normalizeBattleNetData'

import cacheAPI from '@/lib/cacheAPI'
import { JWToken } from '@/types/index'

type UserProfileResponse = BattleNetResponse<UserProfile>

const handle: NextApiHandler = (req, res) =>
  cacheAPI<UserProfileResponse>(req, res, {
    key: { name: req.url, userSpecific: true },
    expiration: ms('1 day'),
    requireAuth: true,
    method: async (req, res, token: JWToken) => {
      const wow = new WoWAPI({
        debug: true,
        accessToken: token.battlenet.accessToken,
        region: token.battlenet.region,
      })
      return await wow.getUserProfile()
    },
    callback: (result) => {
      if (result.error) {
        return result
      }
      return normalizeBattleNetData('userProfile')(result.data)
    },
  })

export default handle
