import {
  BattleNetService,
  BattleNetRegion,
  BattleNetTokenProps,
} from 'battlenet-api'

const getBattleNetToken = async (
  region: BattleNetRegion = 'eu'
): Promise<BattleNetTokenProps> => {
  try {
    const token = await BattleNetService.getToken({
      region,
      clientId: process.env.BNET_CLIENT_ID,
      clientSecret: process.env.BNET_CLIENT_SECRET,
    })
    console.log({ newToken: token })
    return token
  } catch (error) {
    console.log(error)
  }
}

export default getBattleNetToken
