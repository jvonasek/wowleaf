import { useCallback, useEffect, useState } from 'react'
import { useInfiniteQuery, useQueryClient, UseQueryOptions } from 'react-query'

import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'
import { AchievementFilterFactory } from '@/lib/AchievementFilterFactory'
import { IS_PREMIUM } from '@/lib/constants'
import { paginateArray } from '@/lib/paginateArray'
import { qs } from '@/lib/qs'
import { AchievementCard } from '@/modules/achievement/AchievementCard'
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import { Achievement } from '@/modules/achievement/types'

import { CharacterAchievementsFilter } from './CharacterAchievementsFilter'
import { useCharacterAchievementsQuery } from './hooks/useCharacterAchievementsQuery'
import { useAchievementsFilterStore } from './store/useAchievementsFilterStore'
import {
  useCharacterAchievementsStore,
  useCombinedAchievementsStore,
} from './store/useCharacterAchievementsStore'
import {
  CharacterStoreProps,
  useCharacterStore,
} from './store/useCharacterStore'

const PAGINATED_ACHIEVEMENTS_QUERY_KEY = 'WoWPaginatedAchievements'

const fetchAchievementPage = async ({ factionId, category, ids = [] }) => {
  const slug = (category && category.join('/')) || ''
  const isRoot = !slug

  const querystring = qs({
    factionId,
    id: isRoot ? ids : undefined,
  })

  return await fetch(
    `/api/wow/achievements/${slug}${querystring}`
  ).then((res) => res.json())
}

type PaginatedAchievementsQueryHookProps = {
  perPage?: number
  category: string[]
  character: CharacterStoreProps
}

const usePaginatedAchievementsQuery = (
  {
    perPage = 20,
    category,
    character: { faction, characterKey },
  }: PaginatedAchievementsQueryHookProps,
  { enabled }: UseQueryOptions
) => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Achievement[]>([])

  const { filter } = useAchievementsFilterStore()
  const achievements = useAchievementsStore()

  const { getCharacter } = useCharacterAchievementsStore()
  const { combined } = useCombinedAchievementsStore()

  const progress = IS_PREMIUM ? combined : getCharacter(characterKey)

  console.log(progress)

  const isCategoryPage = !!category?.length
  const hasIdsChanged = useHasChanged(progress.ids)
  const hasCategoryChanged = useHasChanged(category)
  const hasFilterChanged = useHasChanged(filter)

  const {
    isSuccess,
    isLoading,
    fetchNextPage,
    data: queryData,
    ...queryResult
  } = useInfiniteQuery<Achievement[]>(
    [
      PAGINATED_ACHIEVEMENTS_QUERY_KEY,
      filter,
      isCategoryPage ? category : 'index',
    ],
    ({ pageParam }) => {
      return fetchAchievementPage({
        category,
        factionId: faction ?? undefined,
        ids: pageParam || progress.ids.slice(0, perPage),
      })
    },
    {
      enabled:
        enabled &&
        !!progress.ids.length &&
        (hasIdsChanged || hasCategoryChanged),
    }
  )

  useEffect(() => {
    if (hasCategoryChanged || hasFilterChanged) {
      setPage(1)
      queryClient.setQueryData(PAGINATED_ACHIEVEMENTS_QUERY_KEY, () => ({
        pages: [],
        pageParams: [],
      }))
    }
  }, [hasCategoryChanged, hasFilterChanged, queryClient])

  useEffect(() => {
    if (isLoading) {
      setData([])
    }

    if (isSuccess) {
      const achievmentFilterSorter = new AchievementFilterFactory({
        achievements: achievements.byId,
        progress: progress.byId,
      })

      const allPages = queryData.pages.reduce((prev, next) => {
        return [...prev, ...next]
      }, [])

      const achs = achievmentFilterSorter
        .apply(allPages)
        .filter(filter)
        .sort()
        .get()

      setData(achs)
    }
  }, [
    isSuccess,
    isLoading,
    filter,
    queryData,
    achievements.byId,
    progress.byId,
  ])

  // everything is fetched on category page, set paginator props to have one page
  const current = data.length
  const total = isCategoryPage ? data.length : progress.ids.length
  const lastPage = isCategoryPage ? 1 : Math.ceil(total / perPage)
  const hasNextPage = isCategoryPage ? false : page < lastPage

  const fetchNextPageFn = useCallback(() => {
    if (hasNextPage) {
      const nextPage = page + 1

      const pageIds = paginateArray(progress.ids, perPage, nextPage)

      fetchNextPage({
        pageParam: pageIds.length ? pageIds : undefined,
      })

      setPage(nextPage)
    }
  }, [hasNextPage, page, progress.ids, perPage, fetchNextPage])

  return {
    ...queryResult,
    data,
    isSuccess,
    isLoading,
    fetchNextPage: fetchNextPageFn,
    hasNextPage,
    paginator: {
      current,
      total,
      page,
      lastPage,
    },
  }
}

type CharacterAchievementsProps = {
  category?: string[]
}

export const CharacterAchievements: React.FC<CharacterAchievementsProps> = ({
  category,
}) => {
  const character = useCharacterStore()

  const {
    isLoading: isCharAchsLoading,
    isSuccess: isCharAchsSuccess,
  } = useCharacterAchievementsQuery([character], {
    enabled: !!character?.characterKey,
  })

  const {
    fetchNextPage,
    hasNextPage,
    paginator: { current, total, page, lastPage },
    data: achievements,
    isLoading: isAchsLoading,
    isSuccess: isAchsSuccess,
  } = usePaginatedAchievementsQuery(
    {
      category,
      character,
    },
    {
      enabled: IS_PREMIUM || isCharAchsSuccess,
    }
  )

  const isLoading = isCharAchsLoading || isAchsLoading
  const isSuccess = isCharAchsSuccess && isAchsSuccess

  useWowheadLinks({ refresh: isSuccess }, [achievements])

  return (
    <div>
      <CharacterAchievementsFilter />
      {isLoading ? <Spinner size="6" /> : ''}
      {!!achievements.length && (
        <span>
          Page {page} / {lastPage} (Showing {current} out of {total})
        </span>
      )}
      <div className="space-y-7">
        {isSuccess &&
          achievements.map((ach) => <AchievementCard key={ach.id} {...ach} />)}
      </div>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()}>LOAD MORE</Button>
      )}
      {!!achievements.length && (
        <span>
          Page {page} / {lastPage} (Showing {current} out of {total})
        </span>
      )}
    </div>
  )
}
