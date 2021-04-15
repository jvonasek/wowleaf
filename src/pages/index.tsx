import { useQuery } from 'react-query'
import { getSession } from 'next-auth/client'
import { NextPage } from 'next'

import { CharacterCard } from '@/components/CharacterCard'

const getUserCharacters = () =>
  fetch(`/api/user/characters`).then((res) => res.json())

const Index: NextPage = () => {
  const { isLoading, data: characters } = useQuery(
    'UserCharacters',
    getUserCharacters
  )
  return (
    <div className="grid grid-cols-4 gap-3">
      {!isLoading &&
        characters.length > 0 &&
        characters.map((char) => (
          <CharacterCard key={char.id} {...char} />
        ))}{' '}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

export default Index
