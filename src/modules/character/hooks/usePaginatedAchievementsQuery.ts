import { pluck } from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
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

  return await fetch(`/api/wow/achievements/${slug}${querystring}`).then(
    (res) => res.json()
  )
}

const defaultPaginatorProps = {
  perPage: 0,
  current: 0,
  total: 0,
  page: 0,
  lastPage: 0,
  overall: 0,
  hasNextPage: false,
  isLoadingNext: false,
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
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [achievementIds, setAchievementIds] = useState([])
  const [data, setData] = useState<Achievement[]>([])
  const [paginator, setPaginator] = useState({
    ...defaultPaginatorProps,
    perPage,
  })

  const achievements = useAchievementsStore()
  const overallAchievementCountRef = useRef(achievements.ids.length)

  const {
    getAggregatedAchievements,
    getCharAchievements,
    isSuccess: isCharacterAchievementsSuccess,
  } = useCharacterAchievementsStore()

  const progress =
    characterKey === 'aggregated'
      ? getAggregatedAchievements()
      : getCharAchievements(characterKey)

  const isCategoryPage = !!category?.length
  const hasIdsChanged = useHasChanged(achievementIds)
  const hasCategoryChanged = useHasChanged(category)
  const hasFilterChanged = useHasChanged(filter)
  const hasFilterOrCategoryChanged = hasIdsChanged || hasCategoryChanged

  const queryEnabled =
    enabled && hasFilterOrCategoryChanged && achievementIds.length > 0

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
      enabled: queryEnabled,
    }
  )

  useEffect(() => {
    if (achievements.isSuccess && isCharacterAchievementsSuccess) {
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
    filter,
    progress.byId,
    achievements.byId,
    achievements.ids,
    achievements.isSuccess,
    isCharacterAchievementsSuccess,
  ])

  // reset query client on category / filter change
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
          ? ([].concat(...queryData.pages) as Achievement[])
          : queryData.pages[0]

      const sortedIds = isCategoryPage
        ? achievementIds.filter((id) => pages.map(({ id }) => id).includes(id))
        : achievementIds

      const sortedPages = pages
        .filter(({ id }) => sortedIds.includes(id))
        .sort((a, b) => {
          return sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id)
        })

      const pageData = isCategoryPage
        ? paginateArray(sortedPages, perPage, page, true)
        : sortedPages

      setData(pageData)

      setPaginator((paginator) => {
        const total = isCategoryPage
          ? sortedPages.length
          : achievementIds.length
        const lastPage = Math.ceil(total / perPage)
        return {
          ...paginator,
          page,
          lastPage,
          current: pageData.length,
          total,
          overall: isCategoryPage
            ? pages.length
            : overallAchievementCountRef.current,
          hasNextPage: page < lastPage,
          isLoadingNext: false,
        }
      })
    }
  }, [
    achievementIds,
    isCategoryPage,
    isLoading,
    isSuccess,
    page,
    perPage,
    queryData,
  ])

  const fetchNextPageFn = useCallback(() => {
    if (isCategoryPage) {
      setPage(page + 1)
    } else {
      if (paginator.hasNextPage) {
        setPaginator((paginator) => ({
          ...paginator,
          isLoadingNext: true,
        }))

        const nextPage = page + 1

        const pageIds = paginateArray(achievementIds, perPage, nextPage)

        fetchNextPage({
          pageParam: pageIds.length ? pageIds : undefined,
        })

        setPage(nextPage)
      }
    }
  }, [
    isCategoryPage,
    page,
    perPage,
    paginator.hasNextPage,
    achievementIds,
    fetchNextPage,
  ])

  return {
    ...queryResult,
    data,
    isSuccess,
    isLoading,
    fetchNextPage: fetchNextPageFn,
    paginator,
  }
}
