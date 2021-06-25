import { memo, useCallback } from 'react'
import { useMutation } from 'react-query'

import { ToggleButton } from '@/components/ToggleButton'
import { CharacterParams } from '@/modules/character/types'
import { Character } from '@/types'

export type CharacterSelectRowProps = Character & {
  isActive: boolean
  onMutate: () => void
}

const createCharacter = ({ region, realmSlug, name }: CharacterParams) =>
  fetch(`/api/bnet/character/${region}/${realmSlug}/${name}`, {
    method: 'PUT',
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })

const deleteCharacter = ({ region, realmSlug, name }: CharacterParams) =>
  fetch(`/api/bnet/character/${region}/${realmSlug}/${name}/delete`, {
    method: 'DELETE',
  })

export const CharacterSelectRow: React.FC<CharacterSelectRowProps> = memo(
  ({
    name,
    level,
    classId,
    region,
    realm,
    realmSlug,
    isActive = false,
    onMutate,
  }) => {
    const { mutate: add } = useMutation(createCharacter, {
      onSettled: onMutate,
      onError: (err, val, c) => {
        console.log('err', err, val, c)
      },
    })

    const { mutate: del } = useMutation(deleteCharacter, {
      onSuccess: onMutate,
    })

    const onToggleChange = useCallback(
      (checked) => {
        const params = {
          region,
          realmSlug,
          name,
        }
        if (checked) {
          add(params)
        } else {
          del(params)
        }
      },
      [add, del, name, realmSlug, region]
    )

    return (
      <tr>
        <td>
          <span className={`font-semibold text-class-${classId}`}>{name}</span>
        </td>
        <td>{level}</td>
        <td>{realm}</td>
        <td>{region?.toUpperCase()}</td>
        <td className="text-right">
          <ToggleButton
            variant="positive"
            size="small"
            checked={isActive}
            onChange={onToggleChange}
          />
        </td>
      </tr>
    )
  }
)
