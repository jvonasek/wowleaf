import {
  gte,
  pluck,
  clamp,
  prop,
  ascend,
  descend,
  sortWith,
  filter,
  allPass,
  lt,
  pick,
} from 'ramda'

import { groupById, percentage, round } from '@/lib/utils'

import {
  AchievementFilterProps,
  CharacterAchievementProgress,
  CharacterAchievementCriterionProgress,
  CharacterAchievementsQueryResult,
  CharacterAchievement,
  CharacterParams,
} from '@/modules/character/types'

import {
  Achievement,
  AchievementsQueryResult,
} from '@/modules/achievement/types'

import { AchievementsStoreObject } from '@/modules/achievement/store/useAchievementsStore'

import {
  initialAchievementProgress,
  CharacterAchievementsStoreObject,
} from '@/modules/character/store/useCharacterAchievementsStore'

type CharacterProps = CharacterParams & {
  characterKey: string
}

type SortDir = 'DESC' | 'ASC'

export class AchievementProgressFactory {
  private achievements: AchievementsStoreObject
  private characters: Array<{
    characterAchievements: CharacterAchievementsQueryResult
    character: CharacterProps
  }>

  constructor({ achievements, characters }) {
    this.achievements = achievements
    this.characters = characters
  }

  getProggress(filterValues: AchievementFilterProps) {
    const progress = this.getProgressArray(filterValues)

    return progress.reduce((prev, character) => {
      return {
        ...prev,
        ...character,
      }
    }, {})
  }

  getProgressArray(filterValues: AchievementFilterProps) {
    return this.characters.map(
      ({ characterAchievements, character: { characterKey } }) => {
        const data = this.merge(characterAchievements)
        const progress = groupById(data)

        const filterSorter = new AchievementFilterSorter({
          achievements: this.achievements.byId,
          progress,
        })

        const achievements = this.achievements.ids.map((id) =>
          this.getAchievementById(id)
        )

        const filteredAndSorted = filterSorter
          .apply(achievements)
          .filter(filterValues)
          .sort()
          .get()

        return {
          [characterKey]: {
            byId: progress,
            ids: pluck('id', filteredAndSorted),
          },
        }
      }
    )
  }

  merge(characterAchievements: CharacterAchievementsQueryResult) {
    return this.achievements.ids.map((id) =>
      this.createAchievementProgress(
        this.achievements.byId[id],
        characterAchievements.byId[id]
      )
    )
  }

  createAchievementProgress(
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

    const criteriaProgress = criteria.map(({ id, amount: requiredAmount }) => {
      const { amount = 0, isCompleted = false } = childCriteriaById?.[id] || {}

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
        partial,
        required,
        percent: percentage(clamp(0, required, partial), required, 1),
        isCompleted,
      }
    })

    const hasChildCriteria = criteriaProgress.length > 0
    const partialAmount = characterAchievement?.criteria?.amount || 0
    const requiredAmount = requiredCriteriaAmount || 1
    const overallCriteriaProgress = this.calculateOverallCriteriaProgress(
      criteriaProgress,
      {
        required: requiredAmount,
        operator: criteriaOperator,
      }
    )

    let percent = hasChildCriteria
      ? overallCriteriaProgress
      : percentage(clamp(0, requiredAmount, partialAmount), requiredAmount, 1)

    // Fix criteria in completed achievements (lich king dungeon),
    // where last criterion is completed, but not first one
    const categoriesWithoutMatchingCriteria = [14806]
    if (categoriesWithoutMatchingCriteria.includes(categoryId)) {
      if (isCompleted && percent < 100) {
        const checks = {
          491: [897, 899],
          497: [2781, 2784],
          496: [3139, 3140],
          500: [5743, 5744],
          490: [7612, 7614],
          498: [2790, 2789],
          489: [2777, 2776],
          492: [9002, 9004],
          495: [14229, 14232],
          499: [2186, 2184],
        }

        const [first, last] = checks[id] || []
        if (first && last) {
          const isFirstCompleted = criteriaProgress.find(
            (criterion) => first === criterion.id
          )?.isCompleted

          const isLastCompleted = criteriaProgress.find(
            (criterion) => last === criterion.id
          )?.isCompleted

          if (!isFirstCompleted && isLastCompleted) {
            percent = 0
          }
        }
      }
    }

    return {
      id,
      name,
      percent: isCompleted ? 100 : percent,
      isCompleted,
      completedTimestamp,
      partial: partialAmount,
      required: requiredAmount,
      showOverallProgressBar: !hasChildCriteria && requiredAmount >= 5,
      criteria: groupById<CharacterAchievementCriterionProgress>(
        criteriaProgress
      ),
    }
  }

  calculateOverallCriteriaProgress(
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

  getAchievementById(id: number) {
    return this.achievements?.byId?.[id]
  }

  getFilterFn = (
    predicateFn: (a: Achievement, p: CharacterAchievementProgress) => boolean
  ) => (progress: CharacterAchievementProgress) => {
    const achievement = this.getAchievementById(progress.id)
    return predicateFn(achievement, progress)
  }
}

export class AchievementFilterSorter {
  private achievements: AchievementsStoreObject['byId']
  private progress: CharacterAchievementsStoreObject['byId']
  public data: Achievement[]
  constructor({
    achievements,
    progress,
  }: {
    achievements: AchievementsStoreObject['byId']
    progress: CharacterAchievementsStoreObject['byId']
  }) {
    this.achievements = achievements
    this.progress = progress
    this.data = []
  }

  apply(data: Achievement[]) {
    this.data = data
    return this
  }

  filter(filterValues: AchievementFilterProps) {
    const isIncompleteFilter = this.getFilterFn(
      (_, progress: CharacterAchievementProgress) => {
        const isNotCompleted =
          lt(prop('percent', progress), 100) && !prop('isCompleted', progress)

        return !prop('incomplete', filterValues) || isNotCompleted
      }
    )

    const isAccountWideFilter = this.getFilterFn(
      (achievement) =>
        prop('includeAccountWide', filterValues) ||
        !prop('isAccountWide', achievement)
    )

    const pointsFilter = this.getFilterFn((achievement) => {
      const points = prop('points', achievement)
      return gte(points)(prop('points', filterValues))
    })

    const rewardFilter = this.getFilterFn(
      (achievement) =>
        !prop('reward', filterValues) ||
        !!prop('rewardDescription', achievement)
    )

    this.data = filter<Achievement>(
      allPass([
        isIncompleteFilter,
        isAccountWideFilter,
        pointsFilter,
        rewardFilter,
      ]),
      this.data
    )

    return this
  }

  sort() {
    const sortProps: Record<string, SortDir>[] = [
      {
        completedTimestamp: 'DESC',
      },
      {
        percent: 'DESC',
      },
      {
        name: 'ASC',
      },
    ]

    this.data = sortWith<Achievement>(
      sortProps.map((s) => {
        const propName = Object.keys(s)[0]
        const dir = Object.values(s)[0]
        return (dir === 'DESC' ? descend : ascend)((ach) => {
          const progress = this.getProgressById(ach.id)

          const values = {
            ...pick(['name', 'id'], ach),
            ...pick(['completedTimestamp', 'percent'], progress),
            completedTimestamp: progress?.completedTimestamp || 0,
          }

          return prop(propName)(values)
        })
      })
    )(this.data)

    return this
  }

  get() {
    return this.data
  }

  getProgressById(id: number) {
    return this.progress?.[id]
  }

  getAchievementById(id: number) {
    return this.achievements?.[id]
  }

  getFilterFn = (
    predicateFn: (a: Achievement, p: CharacterAchievementProgress) => boolean
  ) => (achievement: Achievement) => {
    const progress = this.getProgressById(achievement.id)
    return predicateFn(achievement, progress)
  }
}
