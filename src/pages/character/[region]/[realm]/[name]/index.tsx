import { NextPage, GetServerSideProps } from 'next'
import { enums, object, string } from 'superstruct'

import { BNET_REGIONS } from '@/lib/constants'
import { CharacterProfile } from '@/modules/character/CharacterProfile'
import { CharacterParams } from '@/modules/character/types'

const Character: NextPage<CharacterParams> = ({ region, realm, name }) => {
  //const { region, realm, name } = router.query

  /*   const endpoint = `/api/bnet/character/${region}/${realm}/${name}`

  const { data: char } = useQuery('BnetCharacter', () =>
    fetch(endpoint).then((res) => res.json())
  )

  const { data: charAchievements } = useQuery('BnetCharacterAchievements', () =>
    fetch(`${endpoint}/achievements`).then((res) => res.json())
  )

  const achievements = useQuery<Achievement[]>('WoWAchievements', () =>
    fetch(`/api/wow/achievements`).then((res) => res.json())
  ) */

  return (
    <div>
      <CharacterProfile region={region} realm={realm} name={name} />
    </div>
  )
}

const CharacterRouteStruct = object({
  region: enums(BNET_REGIONS),
  realm: string(),
  name: string(),
})

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [err, values] = CharacterRouteStruct.validate(context.query)
  if (err || !values) {
    return {
      notFound: true,
    }
  }

  return {
    props: values,
  }
}

export default Character
