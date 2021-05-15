import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { create, object, boolean, number } from 'superstruct'

import { useAchievementsFilterStore } from './store/useAchievementsFilterStore'

import { AchievementFilterProps } from './types'

const FilterFormStruct = object({
  incomplete: boolean(),
  reward: boolean(),
  points: number(),
})

export const CharacterAchievementsFilter: React.FC = () => {
  const { setFilter, filter } = useAchievementsFilterStore()
  const {
    watch,
    register,
    handleSubmit,
    control,
  } = useForm<AchievementFilterProps>({
    defaultValues: filter,
    resolver: superstructResolver(FilterFormStruct),
  })

  const values = useWatch({ control, defaultValue: filter })

  const pointsValue = watch('points')

  useEffect(() => {
    setFilter(create(values, FilterFormStruct))
  }, [setFilter, values])

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('incomplete')} type="checkbox" /> Incomplete Only
      <input {...register('reward')} type="checkbox" /> With Reward
      <input
        {...register('points', { valueAsNumber: true })}
        type="range"
        min={0}
        max={25}
        step={1}
      />
      {pointsValue} points
    </form>
  )
}
