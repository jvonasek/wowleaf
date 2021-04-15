import redis from 'redis'
import { promisify } from 'util'

import { GenericObject } from '@/types'

class RedisCacheService {
  protected cache = redis.createClient({
    url: process.env.REDIS_URL,
  })

  protected redisGet = null
  protected redisSet = null
  protected redisUnlink = null
  protected redisScan = null
  protected redisExists = null

  constructor() {
    this.redisGet = promisify(this.cache.get).bind(this.cache)
    this.redisSet = promisify(this.cache.set).bind(this.cache)
    this.redisUnlink = promisify(this.cache.unlink).bind(this.cache)
    this.redisScan = promisify(this.cache.scan).bind(this.cache)
    this.redisExists = promisify(this.cache.exists).bind(this.cache)
  }

  async exists(key: string): Promise<boolean> {
    return await this.redisExists(key).then((reply: 1 | 0) => Boolean(reply))
  }

  async get<T = GenericObject>(key: string): Promise<T | null> {
    console.log(`[REDIS] [${key}] getting from redis`)
    return await this.redisGet(key).then((value: string | null) => {
      try {
        return JSON.parse(value)
      } catch (error) {
        return null
      }
    })
  }

  async set<T = GenericObject>(
    key: string,
    data: T,
    expiration: number
  ): Promise<boolean> {
    const stringData = JSON.stringify(data)
    const seconds = expiration / 1000
    const res = await this.redisSet(key, stringData, 'EX', seconds)
    const success = res === 'OK'

    console.log(
      success
        ? `[REDIS] [${key}] setting to redis with ${seconds} seconds expiration`
        : `[REDIS] [${key}] failure`
    )

    return success
  }

  async delete(pattern: string): Promise<number> {
    console.log(`[REDIS] [${pattern}] deleted from redis`)
    const res = await this.redisScan('0', 'MATCH', pattern)
    const keys = res[1]
    return keys && keys.length ? this.redisUnlink(keys) : 0
  }

  async save<T = GenericObject>({
    key,
    expiration,
    purge = false,
    payload,
  }: {
    key: string
    expiration: number
    purge: boolean
    payload: () => Promise<T>
  }): Promise<T> {
    if (purge) await this.delete(key)

    const exists = await this.exists(key)
    if (exists) {
      return await this.get<T>(key)
    }

    const data = await payload()
    const success = await this.set<T>(key, data, expiration)
    return success ? data : null
  }
}

export default RedisCacheService
