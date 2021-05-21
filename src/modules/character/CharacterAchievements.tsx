import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient, UseQueryOptions } from 'react-query';

import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { useHasChanged } from '@/hooks/useHasChanged';
import { useWowheadLinks } from '@/hooks/useWowheadLinks';
import { AchievementFilterSorter } from '@/lib/AchievementProgressFactory';
import { paginateArray } from '@/lib/paginateArray';
import { qs } from '@/lib/qs';
import { AchievementCard } from '@/modules/achievement/AchievementCard';
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore';
import { Achievement } from '@/modules/achievement/types';
import { Faction } from '@/types';

import { CharacterAchievementsFilter } from './CharacterAchievementsFilter';
import { useCharacterAchievementsQuery } from './hooks/useCharacterAchievementsQuery';
import { useAchievementsFilterStore } from './store/useAchievementsFilterStore';
import { useCharacterAchievementsStore } from './store/useCharacterAchievementsStore';
import { useCharacterStore } from './store/useCharacterStore';

const PAGINATED_ACHIEVEMENTS_QUERY_KEY = 'WoWPaginatedAchievements'

const fetchAchievementPage = async ({ factionId, category, ids = [] }) => {
  const slug = (category && category.join('/')) || ''
  const isRoot = !slug

  const querystring = qs({
    factionId,
    id: isRoot ? ids : undefined,
  })

  return fetch(`/api/wow/achievements/${slug}${querystring}`).then((res) =>
    res.json()
  )
}

type PaginatedAchievementsQueryHookProps = {
  perPage?: number
  category: string[]
  factionId: Faction
  characterKey: string
}

const usePaginatedAchievementsQuery = (
  {
    perPage = 20,
    category,
    factionId,
    characterKey,
  }: PaginatedAchievementsQueryHookProps,
  { enabled }: UseQueryOptions
) => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Achievement[]>([])

  const { filter } = useAchievementsFilterStore()
  const achievements = useAchievementsStore()

  const progress = useCharacterAchievementsStore(
    useCallback(
      (state) =>
        state[characterKey] || {
          ids: [],
          byId: {},
        },
      [characterKey]
    )
  )

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
        factionId,
        ids: pageParam || progress.ids.slice(0, perPage),
      })
    },
    {
      enabled: enabled && (hasIdsChanged || hasCategoryChanged),
    }
  )

  useEffect(() => {
    if (hasCategoryChanged || hasFilterChanged) {
      setPage(1)
      queryClient.setQueryData(PAGINATED_ACHIEVEMENTS_QUERY_KEY, (data) => ({
        pages: [],
        pageParams: [],
      }))
    }
  }, [hasCategoryChanged, hasFilterChanged])

  useEffect(() => {
    if (isLoading) {
      setData([])
    }

    if (isSuccess) {
      const achievmentFilterSorter = new AchievementFilterSorter({
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
  }, [page, perPage, hasNextPage, progress.ids])

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
  const {
    name,
    region,
    realmSlug,
    characterKey,
    faction: factionId,
  } = useCharacterStore()

  const {
    isLoading: isCharAchsLoading,
    isSuccess: isCharAchsSuccess,
  } = useCharacterAchievementsQuery(
    [{ region, realmSlug, name, characterKey }],
    {
      enabled: !!characterKey,
    }
  )

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
      factionId,
      characterKey,
    },
    {
      enabled: isCharAchsSuccess,
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
