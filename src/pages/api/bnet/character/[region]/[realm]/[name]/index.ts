import {
  BattleNetRegion,
  BattleNetResponse,
  LocalizedCharacter,
  WoWAPI,
} from 'battlenet-api'
import ms from 'ms.macro'
import { NextApiHandler } from 'next'

import cacheAPI from '@/lib/cacheAPI'
import getCachedAccessToken from '@/lib/getCachedAccessToken'
import { normalizeBattleNetData } from '@/lib/normalizeBattleNetData'
import prisma from '@/prisma/app'
import { JWToken } from '@/types'

type CharacterResponse = BattleNetResponse<LocalizedCharacter>

const handle: NextApiHandler = (req, res) => {
  const { method } = req
  return cacheAPI<CharacterResponse>(req, res, {
    key: req.url,
    expiration: ms('1 hour'),
    requireAuth: method === 'PUT',
    method: async (req) => {
      const { region, realm, name } = req.query as {
        region: BattleNetRegion
        realm: string
        name: string
      }

      const accessToken = await getCachedAccessToken()
      const wow = new WoWAPI({
        debug: true,
        accessToken,
        region,
      })

      return await wow.getCharacter(realm, name)
    },
    callback: async (result, token) => {
      if (result.error) return result

      switch (method) {
        case 'GET':
          return {
            ...result,
            data: normalizeBattleNetData('character')(result.data),
          }
        case 'PUT':
          return {
            ...result,
            data: await saveCharacterToDb(result.data, token),
          }
        default:
          return result
      }
    },
  })
}

async function saveCharacterToDb(
  character: LocalizedCharacter,
  token: JWToken
) {
  const char = normalizeBattleNetData('character')(character)

  const data = {
    ...char,
    user: {
      connect: { id: token.id },
    },
  }

  return await prisma.character.upsert({
    where: { id: character.id },
    update: data,
    create: data,
  })
}

export default handle
