import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/client'
import { useIsFetching } from 'react-query'

import { ProgressBar } from '@/components/ProgressBar'
import { DashboardAchievementsRouteStruct } from '@/lib/structs'
import { AchievementList } from '@/modules/achievement/AchievementList'
import { useUserCharactersQuery } from '@/modules/character/hooks/useUserCharactersQuery'

export type DashboardAchievementsPageProps = {
  category?: string[]
}

export const DashboardAchievementsPage: React.FC<DashboardAchievementsPageProps> = ({
  category,
}) => {
  const [session] = useSession()
  const { isSuccess, factionId, data } = useUserCharactersQuery({
    userId: session?.user?.id as number,
  })

  const isFetching = useIsFetching({
    predicate: ({ queryKey }) => queryKey.includes('/api/bnet/character'),
  })

  return (
    <div>
      {isFetching > 0 && <ProgressBar value={isFetching} total={data.length} />}
      {isSuccess && (
        <AchievementList
          characterKey="aggregated"
          category={category}
          factionId={factionId}
          isAggregated
        />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [err, query] = DashboardAchievementsRouteStruct.validate(
    context.query,
    {
      coerce: true,
    }
  )

  if (err || !query) {
    return {
      notFound: true,
    }
  }

  return await Promise.resolve({
    props: {
      category: query?.category || null,
    },
  })
}
