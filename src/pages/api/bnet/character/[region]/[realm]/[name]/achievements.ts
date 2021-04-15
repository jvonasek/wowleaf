import { NextApiHandler } from 'next'
import { WoWAPI } from 'battlenet-api'
import ms from 'ms.macro'

import cacheAPI from '@/lib/cacheAPI'
import getCachedAccessToken from '@/lib/getCachedAccessToken'

const handle: NextApiHandler = (req, res) =>
  cacheAPI(req, res, {
    key: req.url,
    expiration: ms('1 hour'),
    method: async (req) => {
      const { region, realm, name } = req.query
      const accessToken = await getCachedAccessToken()
      const wow = new WoWAPI({
        debug: true,
        accessToken,
        region: region,
      })
      return await wow.getCharacterAchievements(realm, name)
    },
    callback: (result: any) => {
      if (result.error) return result

      return result.data
    },
  })

export default handle
