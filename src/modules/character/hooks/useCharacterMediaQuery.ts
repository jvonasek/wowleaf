import { useEffect, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'

import { Gender } from '@/types'

import {
  CharacterMediaAssets,
  CharacterMediaTypes,
  CharacterParams,
} from '../types'

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

const WOW_RENDER_ENDPOINT = 'https://render.worldofwarcraft.com'

export const useCharacterMediaQuery = (
  { region, realmSlug, name, gender, raceId }: CharacterMediaQueryOptions,
  { enabled }: UseQueryOptions
): CharacterMediaQueryValue => {
  const [images, setImages] = useState(initialState)
  const { isSuccess, isLoading, data } = useQuery<CharacterMediaAssets>(
    `/api/bnet/character/${region}/${realmSlug}/${name}/media`,
    { enabled }
  )

  useEffect(() => {
    if (isSuccess) {
      const genderId = gender === 'MALE' ? 0 : 1
      const fallback =
        raceId ?? genderId ? `/shadow/avatar/${raceId}-${genderId}.jpg` : ''

      const images = data.map(({ key, value }) => {
        const image =
          key === 'avatar'
            ? !value
              ? `${WOW_RENDER_ENDPOINT}${fallback}`
              : value
            : value

        return [key, image]
      })

      setImages(Object.fromEntries(images))
    }
  }, [isSuccess, data, raceId, gender])

  return {
    isSuccess,
    isLoading,
    ...images,
  }
}
