import { NextApiRequest, NextApiResponse } from 'next'
import ms from 'ms.macro'

import { RedisCacheService } from '../services'
import getJWT from '@/lib/getJWT'
import responseErrorMessage from '@/lib/responseErrorMessage'
import { JWToken } from '@/types'
import createRedisKey, {
  RedisCacheKey,
  RedisCacheKeyFactory,
} from '@/lib/createRedisKey'

export interface CacheAPIOptions<R> {
  key: RedisCacheKey | RedisCacheKeyFactory
  expiration?: number
  requireAuth?: boolean
  method: (
    req: NextApiRequest,
    res: NextApiResponse,
    token: JWToken
  ) => Promise<R>
  callback: (result: R, token: JWToken) => any
}

const cacheAPI = async <R>(
  req: NextApiRequest,
  res: NextApiResponse,
  {
    key,
    requireAuth = true,
    expiration = ms('1 hour'),
    method,
    callback,
  }: CacheAPIOptions<R>
): Promise<void> => {
  const token = await getJWT(req)
  console.log({ token })

  if (requireAuth && !token) {
    res.status(401).json(responseErrorMessage(401))
    return res.end()
  }

  const cache = new RedisCacheService()
  const redisKey = createRedisKey(key, token)

  const data = await cache.save<R>({
    key: redisKey,
    expiration,
    payload: async () => await method(req, res, token),
  })

  if (data) {
    const result = await callback(data, token)
    res.status(200).json(result)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default cacheAPI
