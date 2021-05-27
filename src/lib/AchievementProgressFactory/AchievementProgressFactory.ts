import { clamp, pluck } from 'ramda'

import { groupById, percentage, round } from '@/lib/utils'
import { AchievementsStoreObject } from '@/modules/achievement/store/useAchievementsStore'
import { Achievement } from '@/modules/achievement/types'
import {
  CharacterAchievementsStoreObject,
  initialAchievementProgress,
} from '@/modules/character/store/useCharacterAchievementsStore'
import { CharacterStoreProps } from '@/modules/character/store/useCharacterStore'
import {
  CharacterAchievement,
  CharacterAchievementCriterionProgress,
  CharacterAchievementProgress,
  CharacterAchievementsQueryResult,
} from '@/modules/character/types'

export class AchievementProgressFactory {
  private achievements: AchievementsStoreObject
  private characters: Array<{
    characterAchievements: CharacterAchievementsQueryResult
    character: CharacterStoreProps
  }>

  constructor({ achievements, characters }) {
    this.achievements = achievements
    this.characters = characters
  }

  get() {
    const progress = this.getProgressArray()
    const p = progress.map((p) => Object.entries(p)[0])
    return Object.fromEntries(p)
  }

  getProgressArray(): Record<string, CharacterAchievementsStoreObject>[] {
    return this.characters.map(({ characterAchievements, character }) => {
      const data = this.create(character, characterAchievements)
      const byId = groupById(data)
      const ids = pluck('id', data)

      return {
        [character.characterKey]: {
          character,
          byId,
          ids,
        },
      }
    })
  }

  create(
    character: CharacterStoreProps,
    characterAchievements: CharacterAchievementsQueryResult
  ) {
    return this.achievements.ids.map((id) =>
      this.createAchievementProgress(
        character,
        this.achievements.byId[id],
        characterAchievements.byId[id]
      )
    )
  }

  createAchievementProgress(
    { characterKey, faction }: CharacterStoreProps,
    {
      id,
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
        id,
      }

    const { isCompleted, completedTimestamp } = characterAchievement

    const childCriteriaById = groupById(
      characterAchievement?.criteria?.childCriteria
    )

    const mainCriteria = characterAchievement?.criteria
    const mainCriteriaAmount = mainCriteria?.amount || 0
    const isAchievementCompleted = isCompleted
    const isMainCriteriaCompleted = !!mainCriteria && mainCriteria.isCompleted

    const criteriaProgress = criteria
      .filter(({ factionId }) => {
        return !factionId || factionId === faction
      })
      .map(({ id, amount: requiredAmount }) => {
        const { amount = 0, isCompleted = false } =
          childCriteriaById?.[id] || {}

        const showProgressBar =
          requiredAmount <= 0 ? false : requiredAmount >= 5 ? true : false

        let partial: number
        let required: number

        if (showProgressBar) {
          partial = amount
          required = requiredAmount
        } else {
          partial = isCompleted ? 1 : 0
          required = 1
        }

        const shouldForceTo100Perc =
          criteria.length <= 1 &&
          isAchievementCompleted &&
          !isMainCriteriaCompleted

        const perc = percentage(clamp(0, required, partial), required, 1)

        const percent = shouldForceTo100Perc ? 100 : perc

        return {
          id,
          showProgressBar,
          partial,
          required,
          percent,
          isCompleted,
        }
      })

    const hasChildCriteria = criteriaProgress.length > 0
    const partialAmount = mainCriteriaAmount || isMainCriteriaCompleted ? 1 : 0
    const requiredAmount = requiredCriteriaAmount || 1
    const overallCriteriaPercent = this.calculateOverallCriteriaPercentage(
      criteriaProgress,
      {
        required: requiredAmount,
        operator: criteriaOperator,
      }
    )

    const overallPercent = percentage(
      clamp(0, requiredAmount, partialAmount),
      requiredAmount,
      1
    )

    let percent = hasChildCriteria ? overallCriteriaPercent : overallPercent

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
      percent,
      isCompleted,
      completedTimestamp,
      partial: partialAmount,
      required: requiredAmount,
      showOverallProgressBar: !hasChildCriteria && requiredAmount >= 5,
      characterKey,
      criteria: groupById<CharacterAchievementCriterionProgress>(
        criteriaProgress
      ),
    }
  }

  calculateOverallCriteriaPercentage(
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
