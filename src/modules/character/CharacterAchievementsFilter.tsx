import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { boolean, create, number, object } from 'superstruct';

import { superstructResolver } from '@hookform/resolvers/superstruct';

import { useAchievementsFilterStore } from './store/useAchievementsFilterStore';
import { AchievementFilterProps } from './types';

const FilterFormStruct = object({
  incomplete: boolean(),
  reward: boolean(),
  points: number(),
  includeAccountWide: boolean(),
})

export const _CharacterAchievementsFilter: React.FC = () => {
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
      <div className="flex align-center space-x-4">
        <span>
          <input {...register('incomplete')} type="checkbox" /> Incomplete Only
        </span>
        <span>
          <input {...register('reward')} type="checkbox" /> With Reward
        </span>
        <span>
          <input {...register('includeAccountWide')} type="checkbox" /> Include
          account wide
        </span>
        <span>
          <input
            {...register('points', { valueAsNumber: true })}
            type="range"
            min={0}
            max={50}
            step={1}
          />
          {pointsValue} points
        </span>
      </div>
    </form>
  )
}

export const CharacterAchievementsFilter = dynamic(
  () => Promise.resolve(_CharacterAchievementsFilter),
  {
    ssr: false,
  }
)
