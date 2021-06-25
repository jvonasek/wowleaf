import { apiHandler } from '@/lib/apiHandler'
import { createCharacterKey } from '@/lib/createCharacterKey'
import getJWT from '@/lib/getJWT'
import { responseErrorMessage } from '@/lib/responseErrorMessage'
import prisma from '@/prisma/app'
import { BattleNetRegion } from '@/types'

type QueryParams = {
  region: BattleNetRegion
  realm: string
  name: string
}

const handle = apiHandler({ requireAuth: true }).delete(async (req, res) => {
  const token = await getJWT(req)
  const { region, realm, name } = req.query as QueryParams

  const id = createCharacterKey({
    region,
    realmSlug: realm,
    name,
  })

  const character = await prisma.character.findUnique({
    where: { id },
  })

  if (!character) {
    res.status(404).json(responseErrorMessage(404))
    return
  }

  if (character.userId === token.id) {
    const result = await prisma.character.delete({
      where: { id },
    })
    res.json(result)
  } else {
    res.status(403).json(responseErrorMessage(403))
  }
})

export default handle
