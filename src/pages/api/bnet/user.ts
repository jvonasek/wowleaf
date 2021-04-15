import { NextApiHandler } from 'next'
import { WoWAPI } from 'battlenet-api'
import ms from 'ms.macro'

import getUserCharactersFromAccounts from '@/lib/getUserCharactersFromAccounts'

import cacheAPI from '@/lib/cacheAPI'
import { JWToken } from '@/types/index'

const handle: NextApiHandler = (req, res) =>
  cacheAPI(req, res, {
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
    callback: (result: any) => {
      console.log(result)
      if (result.error) {
        return result
      }
      return getUserCharactersFromAccounts(result.data.wow_accounts)
    },
  })

export default handle
