import { NextApiHandler } from 'next'
import { PrismaClient } from '@prisma/client'
import { WoWAPI, BattleNetResponse, LocalizedCharacter } from 'battlenet-api'

import { JWToken } from '@/types'
import cacheAPI from '@/lib/cacheAPI'
import getCachedAccessToken from '@/lib/getCachedAccessToken'

type CharacterResponse = BattleNetResponse<LocalizedCharacter>

const prisma = new PrismaClient()

const realmRegionMap = {
  eu: 'Europe',
  us: 'North America',
}

const handle: NextApiHandler = async (req, res) => {
  const [region, realm, name] = req.query.character

  /* const character = await prisma.character.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      realm: {
        slug: realm,
        region: realmRegionMap[region],
      },
    },
  })

  if (character) {
    console.log(character)
    res.status(200).json(character)
    return
  } */

  return await cacheAPI<CharacterResponse>(req, res, {
    key: () => req.url,
    method: async () => {
      const accessToken = await getCachedAccessToken()
      console.log('fetching with', accessToken)
      const wow = new WoWAPI({
        accessToken,
        region,
      })
      const char = await wow.getCharacter(realm, name.toLowerCase())
      return char
    },
    callback: async (result, token) => {
      if (result.error) {
        return result
      }

      return await setCharacter(result.data, token)
    },
  })
}

async function setCharacter(character: LocalizedCharacter, token: JWToken) {
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
