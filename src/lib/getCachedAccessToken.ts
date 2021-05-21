import { BattleNet, BattleNetTokenProps } from 'battlenet-api';
import ms from 'ms.macro';

import { RedisCacheService } from '@/services/RedisCacheService';

const getCachedAccessToken = async (): Promise<
  BattleNetTokenProps['access_token']
> => {
  const cache = new RedisCacheService()
  const payload = await BattleNet.getToken({
    region: 'eu',
    clientId: process.env.BNET_CLIENT_ID,
    clientSecret: process.env.BNET_CLIENT_SECRET,
  })
  const data = await cache.save<BattleNetTokenProps>({
    key: 'access_token',
    expiration: ms('0.995 days'),
    payload,
  })

  return data?.access_token
}

export default getCachedAccessToken
