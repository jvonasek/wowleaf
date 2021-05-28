import dynamic from 'next/dynamic'
import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { boolean, number, object } from 'superstruct'

import { superstructResolver } from '@hookform/resolvers/superstruct'

import { useAchievementsFilterStore } from './store/useAchievementsFilterStore'
import { AchievementFilterProps } from './types'
import { noop } from '@/lib/utils'

type CharacterAchievementsFilter = {
  onChange: (v: AchievementFilterProps) => void
}

const FilterFormStruct = object({
  incomplete: boolean(),
  reward: boolean(),
  points: number(),
  includeAccountWide: boolean(),
})

export const _CharacterAchievementsFilter: React.FC<CharacterAchievementsFilter> = memo(
  ({ onChange = noop }) => {
    const { setFilter, filter } = useAchievementsFilterStore()
    const { register, getValues } = useForm<AchievementFilterProps>({
      defaultValues: filter,
      resolver: superstructResolver(FilterFormStruct),
    })

    const handleOnChange = useCallback(() => {
      const values = getValues()
      onChange(values)
      setFilter(values)
    }, [getValues, onChange, setFilter])

    return (
      <form onChange={handleOnChange}>
        <div className="flex align-center space-x-4">
          <span>
            <input {...register('incomplete')} type="checkbox" /> Incomplete
            Only
          </span>
          <span>
            <input {...register('reward')} type="checkbox" /> With Reward
          </span>
          <span>
            <input {...register('includeAccountWide')} type="checkbox" />{' '}
            Include account wide
          </span>
          <span>
            <input
              {...register('points', { valueAsNumber: true })}
              type="range"
              min={0}
              max={50}
              step={1}
            />
            points
          </span>
        </div>
      </form>
    )
  }
)

export const CharacterAchievementsFilter = dynamic(
  () => Promise.resolve(_CharacterAchievementsFilter),
  {
    ssr: false,
  }
)
