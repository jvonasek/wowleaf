import { JWToken } from '@/types'

export type RedisCacheKey = { name: string; userSpecific?: boolean } | string
export type RedisCacheKeyFactory = (token: JWToken) => string

const createRedisKey = (
  key: RedisCacheKey | RedisCacheKeyFactory,
  token?: JWToken
): string => {
  if (typeof key === 'function') {
    return key(token)
  }

  if (typeof key === 'string') {
    return key
  }

  const { name, userSpecific } = key

  if (userSpecific && token) {
    return `user:${token.id}:${name}`
  }

  return name
}

export default createRedisKey
