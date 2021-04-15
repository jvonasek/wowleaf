import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from 'react-query'

/* const getCharacter = ({ region, realm, name }) =>
  fetch(`/api/character/${region}/${realm}/${name}`).then((res) => res.json()) */

const Character: NextPage = () => {
  const router = useRouter()
  const { character } = router.query
  const [region, realm, name] = character

  const { isLoading, error, data } = useQuery('Character', () =>
    fetch(`/api/character/${region}/${realm}/${name}`).then((res) => res.json())
  )

  console.log(data)

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

Character.getInitialProps = async () => {
  return {}
}

export default Character
