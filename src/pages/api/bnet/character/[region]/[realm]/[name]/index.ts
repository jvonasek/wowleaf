import { NextApiHandler } from 'next'
import { WoWAPI, BattleNetResponse, LocalizedCharacter } from 'battlenet-api'
import { PrismaClient } from '@prisma/client'
import ms from 'ms.macro'

import { JWToken } from '@/types'
import cacheAPI from '@/lib/cacheAPI'
import getCachedAccessToken from '@/lib/getCachedAccessToken'

const prisma = new PrismaClient()

type CharacterResponse = BattleNetResponse<LocalizedCharacter>

const handle: NextApiHandler = (req, res) => {
  const { method } = req
  return cacheAPI<CharacterResponse>(req, res, {
    key: req.url,
    expiration: ms('1 hour'),
    purge: true,
    requireAuth: method === 'PUT',
    method: async (req) => {
      const { region, realm, name } = req.query
      const accessToken = await getCachedAccessToken()
      const wow = new WoWAPI({
        debug: true,
        accessToken,
        region: region,
      })
      return await wow.getCharacter(realm, name)
    },
    callback: async (result: any, token: JWToken) => {
      //@TODO handle errors
      if (result.error) return result

      switch (method) {
        case 'GET':
          return result.data
        case 'PUT':
          return await saveCharacterToDb(result.data, token)
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
  const data = {
    id: character.id,
    name: character.name,
    class: character.character_class.name,
    race: character.race.name,
    faction: character.faction.type,
    gender: character.gender.type,
    guildName: character.guild && character.guild.name,
    level: character.level,
    lastLogin: new Date(character.last_login_timestamp),
    user: {
      connect: { id: token.id },
    },
    realm: {
      connect: { id: character.realm.id },
    },
  }

  return await prisma.character.upsert({
    where: { id: character.id },
    update: data,
    create: data,
  })
}

export default handle
