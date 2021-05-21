import { useEffect, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'

import {
  CharacterMediaTypes,
  CharacterMediaAssets,
  CharacterParams,
} from '../types'

import { Gender } from '@/types'

type CharacterMediaQueryOptions = CharacterParams & {
  raceId?: number
  gender?: Gender
}

type CharacterMediaQueryImages = Record<CharacterMediaTypes, string>
type CharacterMediaQueryValue = {
  isSuccess: boolean
  isLoading: boolean
} & CharacterMediaQueryImages

const initialState = {
  avatar: '',
  inset: '',
  main: '',
  'main-raw': '',
}

export const useCharacterMediaQuery = (
  { region, realmSlug, name, gender, raceId }: CharacterMediaQueryOptions,
  { enabled }: UseQueryOptions
): CharacterMediaQueryValue => {
  const [images, setImages] = useState(initialState)
  const { isSuccess, isLoading, data } = useQuery<CharacterMediaAssets>(
    [
      'BnetCharacterMedia',
      {
        region,
        realmSlug,
        name,
      },
    ],
    () =>
      fetch(
        `/api/bnet/character/${region}/${realmSlug}/${name}/media`
      ).then((res) => res.json()),
    { enabled }
  )

  useEffect(() => {
    if (isSuccess) {
      const genderId = gender === 'MALE' ? 0 : 1
      const fallback =
        raceId ?? genderId
          ? `?alt=/shadow/avatar/${raceId}-${genderId}.jpg`
          : ''

      setImages(
        data.reduce((prev, { key, value }) => {
          return {
            ...prev,
            [key]: `${value}${fallback}`,
          }
        }, initialState)
      )
    }
  }, [isSuccess, data, raceId, gender])

  return {
    isSuccess,
    isLoading,
    ...images,
  }
}
