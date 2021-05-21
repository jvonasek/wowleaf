import ms from 'ms.macro'
import { NextApiRequest, NextApiResponse } from 'next'

import createRedisKey, {
  RedisCacheKey,
  RedisCacheKeyFactory,
} from '@/lib/createRedisKey'
import getJWT from '@/lib/getJWT'
import { responseErrorMessage } from '@/lib/responseErrorMessage'
import { RedisCacheService } from '@/services/RedisCacheService'
import { BattleNetResponse, JWToken } from '@/types'

export interface CacheAPIOptions<R> {
  key: RedisCacheKey | RedisCacheKeyFactory
  expiration?: number
  requireAuth?: boolean
  purge?: boolean
  method: (
    req: NextApiRequest,
    res: NextApiResponse,
    token: JWToken
  ) => Promise<R>
  callback: (result: R, token: JWToken) => Promise<any> | any
}

const cacheAPI = async <R extends BattleNetResponse>(
  req: NextApiRequest,
  res: NextApiResponse,
  {
    key,
    requireAuth = false,
    expiration = ms('1 hour'),
    purge = false,
    method,
    callback,
  }: CacheAPIOptions<R>
): Promise<void> => {
  const token = await getJWT(req)

  if (requireAuth && !token) {
    res.status(401).json(responseErrorMessage(401))
    return res.end()
  }

  const cache = new RedisCacheService()
  const redisKey = createRedisKey(key, token)

  const payload = await method(req, res, token)
  const data = await cache.save<R>({
    key: redisKey,
    expiration,
    purge: purge || payload.error,
    payload,
  })

  if (data) {
    const result = await callback(data, token)
    res.status(200).json(result)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default cacheAPI
