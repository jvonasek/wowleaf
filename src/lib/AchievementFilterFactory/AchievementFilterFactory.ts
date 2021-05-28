import {
  allPass,
  ascend,
  descend,
  filter,
  gte,
  pick,
  prop,
  sortWith,
} from 'ramda'

import { AchievementsStoreObject } from '@/modules/achievement/store/useAchievementsStore'
import { Achievement } from '@/modules/achievement/types'
import { CharacterAchievementsStoreObject } from '@/modules/character/store/useCharacterAchievementsStore'
import {
  AchievementFilterProps,
  CharacterAchievementProgress,
} from '@/modules/character/types'

type SortDir = 'DESC' | 'ASC'

export class AchievementFilterFactory {
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
        return (
          !prop('incomplete', filterValues) || !prop('isCompleted', progress)
        )
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
        isCompleted: 'DESC',
      },
      {
        percent: 'DESC',
      },
      {
        completedTimestamp: 'DESC',
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
            ...pick(['completedTimestamp', 'percent', 'isCompleted'], progress),
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
