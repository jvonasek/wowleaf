import { pluck } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { useInfiniteQuery, useQueryClient, UseQueryOptions } from 'react-query'

import { useHasChanged } from '@/hooks/useHasChanged'
import { AchievementFilterFactory } from '@/lib/AchievementFilterFactory'
import { paginateArray, qs } from '@/lib/utils'
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import { Achievement } from '@/modules/achievement/types'
import { Faction, AchievementFilterProps } from '@/types'

import { useCharacterAchievementsStore } from '@/modules/character/store/useCharacterAchievementsStore'

type PaginatedAchievementsQueryHookProps = {
  perPage?: number
  filter: AchievementFilterProps
  category: string[]
  characterKey: string
  factionId: Faction
}

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

export const usePaginatedAchievementsQuery = (
  {
    category,
    characterKey,
    filter,
    factionId,
    perPage = 20,
  }: PaginatedAchievementsQueryHookProps,
  { enabled }: UseQueryOptions
) => {
  const [isLoadingNext, setIsLoadingNext] = useState(false)
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [achievementIds, setAchievementIds] = useState([])
  const [data, setData] = useState<Achievement[]>([])

  const achievements = useAchievementsStore()

  const {
    getAggregatedAchievements,
    getCharAchievements,
  } = useCharacterAchievementsStore()

  const progress =
    characterKey === 'aggregated'
      ? getAggregatedAchievements()
      : getCharAchievements(characterKey)

  const isCategoryPage = !!category?.length
  const hasIdsChanged = useHasChanged(achievementIds)
  const hasCategoryChanged = useHasChanged(category)
  const hasFilterChanged = useHasChanged(filter)

  useEffect(() => {
    if (hasIdsChanged || hasFilterChanged) {
      const achievmentFilterSorter = new AchievementFilterFactory({
        achievements: achievements.byId,
        progress: progress.byId,
      })

      const achs = achievmentFilterSorter
        .apply(achievements.ids.map((id) => achievements.byId[id]))
        .filter(filter)
        .sort()
        .get()

      setAchievementIds(pluck('id', achs))
    }
  }, [
    achievements.byId,
    achievements.ids,
    filter,
    hasFilterChanged,
    hasIdsChanged,
    progress.byId,
  ])

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
        factionId: factionId ?? undefined,
        ids: pageParam || achievementIds.slice(0, perPage),
      })
    },
    {
      enabled:
        enabled &&
        !!achievementIds.length &&
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
    if (isSuccess && queryData?.pages) {
      const pages =
        queryData.pages.length > 1
          ? [].concat(...queryData.pages)
          : queryData.pages[0]

      const sortedIds = isCategoryPage
        ? achievementIds.filter((id) => pages.map(({ id }) => id).includes(id))
        : achievementIds

      const sortedPages = pages
        .filter(({ id }) => sortedIds.includes(id))
        .sort((a, b) => {
          return sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id)
        })

      setData(sortedPages)
      setIsLoadingNext(false)
    }
  }, [achievementIds, isCategoryPage, isLoading, isSuccess, queryData])

  // everything is fetched on category page, set paginator props to have one page
  const current = data.length
  const total = isCategoryPage ? data.length : achievementIds.length
  const lastPage = isCategoryPage ? 1 : Math.ceil(total / perPage)
  const hasNextPage = isCategoryPage ? false : page < lastPage

  const fetchNextPageFn = useCallback(() => {
    if (hasNextPage) {
      setIsLoadingNext(true)

      const nextPage = page + 1

      const pageIds = paginateArray(achievementIds, perPage, nextPage)

      fetchNextPage({
        pageParam: pageIds.length ? pageIds : undefined,
      })

      setPage(nextPage)
    }
  }, [hasNextPage, page, achievementIds, perPage, fetchNextPage])

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
      isLoadingNext,
    },
  }
}
