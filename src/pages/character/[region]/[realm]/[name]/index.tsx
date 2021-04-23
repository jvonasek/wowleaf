import { GetServerSideProps } from 'next'
import { enums, object, string } from 'superstruct'

import { BNET_REGIONS } from '@/lib/constants'
import { CharacterPage } from '@/modules/character/CharacterPage'

export default CharacterPage

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
