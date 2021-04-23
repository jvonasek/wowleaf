import { NextPage } from 'next'

import { CharacterProfile } from './CharacterProfile'
import { CharacterParams } from './types'

export const CharacterPage: NextPage<CharacterParams> = ({
  region,
  realm,
  name,
}) => {
  return (
    <div>
      <CharacterProfile region={region} realm={realm} name={name} />
    </div>
  )
}
