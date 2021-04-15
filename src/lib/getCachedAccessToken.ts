import { BattleNet, BattleNetTokenProps } from 'battlenet-api'
import ms from 'ms.macro'

import { RedisCacheService } from '../services'

const getCachedAccessToken = async (): Promise<
  BattleNetTokenProps['access_token']
> => {
  const cache = new RedisCacheService()
  const data = await cache.save<BattleNetTokenProps>({
    key: 'access_token',
    expiration: ms('0.995 days'),
    payload: async () =>
      await BattleNet.getToken({
        region: 'eu',
        clientId: process.env.BNET_CLIENT_ID,
        clientSecret: process.env.BNET_CLIENT_SECRET,
      }),
  })

  return data?.access_token
}

export default getCachedAccessToken
