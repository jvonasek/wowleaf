import { useState, useEffect } from 'react'
import { LocalizedCharacterAchievement } from 'battlenet-api'
import {
  pluck,
  clamp,
  prop,
  ascend,
  descend,
  sortWith,
  filter,
  allPass,
} from 'ramda'
import { groupById, percentage, round } from '@/lib/utils'
import { useTypeSafeQueries } from '@/hooks/useTypeSafeQueries'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'

import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import {
  useCharacterAchievementsStore,
  initialAchievementProgress,
} from '../store/useCharacterAchievementsStore'

import {
  AchievementFilterProps,
  CharacterAchievementProgress,
  CharacterAchievementCriterionProgress,
  CharacterAchievementsQueryResult,
  CharacterAchievement,
  CharacterParams,
} from '../types'

import {
  Achievement,
  AchievementsQueryResult,
} from '@/modules/achievement/types'

import { useAchievementsFilterStore } from '../store/useAchievementsFilterStore'

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

type CharacterProps = CharacterParams & {
  characterKey: string
}

type CharacterQueryOptions = {
  enabled?: boolean
}

type SortDir = 'DESC' | 'ASC'

const sorter = (propName: string, dir: SortDir) =>
  (dir === 'DESC' ? descend : ascend)(prop(propName))

const fetchCharacter = ({ region, realmSlug, name }) =>
  fetch(`/api/bnet/character/${region}/${realmSlug}/${name}/achievements`).then(
    async (res) => {
      const data = await res.json()
      return transformCharacterAchievementsData(data)
    }
  )

export const useCharacterAchievementsQuery = (
  characters: CharacterProps[],
  { enabled = false }: CharacterQueryOptions = {}
): CharacterAchievementsHookProps => {
  const achievementsData = useAchievementsStore()
  const filterValues = useAchievementsFilterStore((state) => state.filter)

  const { set } = useCharacterAchievementsStore()
  const [status, setStatus] = useState({ isSet: false })

  const queries = useTypeSafeQueries(
    characters.map(({ region, realmSlug, name, characterKey }) => {
      const queryEnabled =
        enabled && !!characterKey && achievementsData.isSuccess
      return {
        queryKey: ['BnetCharacterAchievements', characterKey],
        queryFn: () => fetchCharacter({ region, realmSlug, name }),
        enabled: queryEnabled,
      }
    })
  )

  const isSuccess = queries.every((q) => q.isSuccess)
  const isLoading = queries.some((q) => q.isLoading)

  useEffect(() => {
    if (isSuccess && achievementsData.isSuccess) {
      const characterData = queries.map(({ data }, index) => ({
        data,
        character: characters[index],
      }))

      const characterProgressArray = createCharacterProgressArray(
        characterData,
        achievementsData,
        filterValues
      )

      const charactersAchievements = characterProgressArray.reduce(
        (prev, character) => {
          return {
            ...prev,
            ...character,
          }
        },
        {}
      )

      set(charactersAchievements)
      setStatus({ isSet: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    filterValues,
    achievementsData,
    achievementsData.isSuccess,
    set,
  ])

  return {
    isLoading: isLoading && !status.isSet,
    isSuccess: isSuccess && status.isSet,
  }
}

function createCharacterProgressArray(
  characters: Array<{
    data: CharacterAchievementsQueryResult
    character: CharacterProps
  }>,
  achievements: AchievementsQueryResult,
  filterValues: AchievementFilterProps
) {
  return characters.map(({ data, character: { characterKey } }) => {
    const achievementProgress = achievements.ids.map((id) =>
      createAchievementProgress(achievements.byId[id], data.byId[id])
    )

    const sortProps: Record<string, SortDir>[] = [
      {
        percent: 'DESC',
      },
      {
        name: 'ASC',
      },
    ]

    const isIncompleteFilter = ({
      percent,
      isCompleted,
    }: CharacterAchievementProgress) => {
      if (filterValues.incomplete) {
        return !isCompleted && percent < 100
      }

      return true
    }

    const isAccountWideFilter = ({ id }: CharacterAchievementProgress) => {
      const achievement = achievements?.byId?.[id]
      if (achievement && filterValues.includeAccountWide === false) {
        return !achievement.isAccountWide
      }

      return true
    }

    const pointsFilter = ({ id }: CharacterAchievementProgress) => {
      const achievement = achievements?.byId?.[id]
      if (achievement && filterValues.points > 0) {
        return achievement.points >= filterValues.points
      }

      return true
    }

    const rewardFilter = ({ id }: CharacterAchievementProgress) => {
      const achievement = achievements?.byId?.[id]
      if (achievement && filterValues.reward) {
        return !!achievement.rewardDescription
      }

      return true
    }

    const filtered = filter<CharacterAchievementProgress>(
      allPass([
        isIncompleteFilter,
        isAccountWideFilter,
        pointsFilter,
        rewardFilter,
      ]),
      achievementProgress
    )

    const sorted = sortWith<CharacterAchievementProgress>(
      sortProps.map((s) => {
        return sorter(Object.keys(s)[0], Object.values(s)[0])
      })
    )(filtered)

    return {
      [characterKey]: {
        byId: groupById(achievementProgress),
        ids: pluck('id', sorted).slice(0, 300),
      },
    }
  })
}

function flattenChildCriteria(
  data: any = [],
  parentCriteriaId: number = null
): any {
  return data.flatMap(({ id, child_criteria, ...rest }: any) => [
    { id, parentCriteriaId, ...rest },
    ...flattenChildCriteria(child_criteria, id),
  ])
}

function transformCharacterAchievementsData(
  data: LocalizedCharacterAchievement[]
) {
  const achievements = data.map(({ id, completed_timestamp, criteria }) => ({
    id,
    isCompleted: !!completed_timestamp,
    completedTimestamp: completed_timestamp,
    criteria: transformCriteriaObject(criteria),
  }))

  const byId = groupById<CharacterAchievement>(achievements)
  const ids = pluck('id', achievements)

  return {
    byId,
    ids,
  }

  function transformCriteriaObject(
    criteria: LocalizedCharacterAchievement['criteria']
  ) {
    if (criteria) {
      const {
        id,
        amount,
        is_completed,
        child_criteria,
        parentCriteriaId,
      } = criteria
      const criterion = {
        id: id,
        amount: amount || 0,
        parentCriteriaId,
        isCompleted: !!is_completed,
      }

      const childCriteria = flattenChildCriteria(child_criteria)

      if (child_criteria) {
        return {
          ...criterion,
          childCriteria: childCriteria?.map(transformCriteriaObject),
        }
      }

      return criterion
    }
  }
}

function createAchievementProgress(
  {
    id,
    name,
    criteria,
    criteriaOperator,
    requiredCriteriaAmount,
    categoryId,
  }: Achievement,
  characterAchievement?: CharacterAchievement
): CharacterAchievementProgress {
  if (!characterAchievement)
    return {
      ...initialAchievementProgress,
      name,
      id,
    }

  const { isCompleted, completedTimestamp } = characterAchievement

  const childCriteriaById = groupById(
    characterAchievement?.criteria?.childCriteria
  )

  const criteriaProgress = criteria.map(
    ({ id, amount: requiredAmount, ...criterion }) => {
      const { amount = 0, parentCriteriaId, isCompleted = false } =
        childCriteriaById?.[id] || {}

      const showProgressBar = requiredAmount <= 0 ? false : requiredAmount >= 5 //!!criterion.showProgressBar

      let partial: number
      let required: number

      if (showProgressBar) {
        partial = amount
        required = requiredAmount
      } else {
        partial = isCompleted ? 1 : 0
        required = 1
      }

      return {
        id,
        showProgressBar,
        parentCriteriaId,
        partial,
        required,
        percent: percentage(clamp(0, required, partial), required, 1),
        isCompleted,
      }
    }
  )

  /* const nest = (items, id = null, link = 'parentCriteriaId', depth = 0) => {
    return items
      .filter((item) => item[link] === id)
      .map((item, index) => {
        //const children = nest(items, item.id, index)
        if (children.length === 1) {
          return children[0]
        }
        return {
          ...item,
          depth,
          children: nest(items, item.id, index),
        }
      })
  } */

  /* const nest2 = (items, id = null, link = 'parentCriteriaId') =>
    items
      .filter((item) => item[link] === id)
      .map((item, index) => {
        const children = nest2(items, item.id)
        return {
          ...item,
          children,
          description: criteria.find(({ id }) => id === item.id)?.description,
        }
      }) */

  /* const getArrayDepth = (arr) => {
    if (Array.isArray(arr)) {
      // if arr is an array, recurse over it
      return 1 + Math.max(...arr.map(getArrayDepth))
    }
    if (arr.children && arr.children.length) {
      // if arr is an object with a children property, recurse over the children
      return 1 + Math.max(...arr.children.map(getArrayDepth))
    }
    return 0
  } */

  //const nestedCriteriaProgress = nest2(criteriaProgress)

  /* const filteredCriteriaProgress = criteriaProgress.filter(({ id }) =>
    ids.includes(id)
  ) */

  /* const depth = getArrayDepth(nestedCriteriaProgress)
  if (depth > 1) {
    console.log('DEPTH', depth, id, name, {
      criteriaProgress,
      nestedCriteriaProgress,
      depth,
    })
  } */

  //const hasChildCriteria = criteriaProgress.length > 0
  const hasChildCriteria = criteriaProgress.length > 0
  const partialAmount = characterAchievement?.criteria?.amount || 0
  const requiredAmount = requiredCriteriaAmount || 1
  const overallCriteriaProgress = calculateOverallCriteriaProgress(
    criteriaProgress,
    {
      required: requiredAmount,
      operator: criteriaOperator,
    }
  )

  let percent = hasChildCriteria
    ? overallCriteriaProgress
    : percentage(clamp(0, requiredAmount, partialAmount), requiredAmount, 1)

  let criteriaProgressArray = criteriaProgress

  if (percent === 100 && !isCompleted) {
    console.log(id, name)
  }

  // Fix criteria in completed achievements (lich king dungeon),
  // where last criterion is completed, but not previous ones
  /* const categoriesWithoutMatchingCriteria = [14806]
  if (categoriesWithoutMatchingCriteria.includes(categoryId)) {
    const isCompletedWithoutMatchingCriteria =
      isCompleted &&
      percent > 0 &&
      percent < 100 &&
      mainCriteriaProgress.length >= 3 &&
      mainCriteriaProgress.length <= 5

    if (isCompletedWithoutMatchingCriteria) {
      const completedCriteria = mainCriteriaProgress.filter(
        ({ isCompleted }) => isCompleted
      )

      // force 100% completion on all criteria when only some are completed (usually last boss)
      if (completedCriteria.length > 0) {
        percent = 100
        criteriaProgressArray = mainCriteriaProgress.map((criterion) => ({
          ...criterion,
          isCompleted: true,
          percent: 100,
        }))
      }
    }
  } */

  /*   if (!isCompleted && percent === 100) {
    console.log({
      id,
      name,
    })
  } */

  return {
    id,
    name,
    percent,
    isCompleted,
    completedTimestamp,
    partial: partialAmount,
    required: requiredAmount,
    showOverallProgressBar: !hasChildCriteria && requiredAmount >= 5,
    criteria: groupById<CharacterAchievementCriterionProgress>(
      criteriaProgressArray
    ),
  }
}

function calculateOverallCriteriaProgress(
  criteria: CharacterAchievementCriterionProgress[],
  { operator, required }: { operator: string; required: number }
): number {
  const total = criteria.length
  const partial = criteria.filter(({ isCompleted }) => isCompleted).length
  const average = round(
    criteria.reduce((prev, { percent }) => prev + percent, 0) / total,
    1
  )

  if (operator === 'ANY') {
    const partialClamped = clamp(0, required, partial)
    return percentage(partialClamped, required, 1)
  }

  return average || 0
}
