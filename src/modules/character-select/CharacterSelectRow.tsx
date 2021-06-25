import { memo, useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { Boom, isBoom } from '@hapi/boom'

import { ToggleButton } from '@/components/ToggleButton'
import { Character } from '@/types'
import { createMutationFn } from '@/lib/createMutationFn'
import {
  useNotificationStore,
  NotifyFn,
} from '@/modules/notifications/store/useNotificationStore'

export type CharacterSelectRowProps = Character & {
  isActive: boolean
  onMutate: () => void
}

const handleMutationError = (err: Boom | Error, notify: NotifyFn) => {
  if (isBoom(err)) {
    notify({
      type: 'danger',
      content: err.output.payload.message,
    })
  }
}

export const CharacterSelectRow: React.FC<CharacterSelectRowProps> = memo(
  ({ id, name, level, classId, region, realm, isActive = false, onMutate }) => {
    const [hasError, setHasError] = useState(false)
    const notify = useNotificationStore((state) => state.notify)

    const { mutate: saveToDb } = useMutation(
      createMutationFn({
        url: `/api/bnet/character/${id}`,
        method: 'PUT',
        errorMessages: {
          404: `Character ${name} wasn't found on BattleNet. Try relogging the character in World of Warcraft.`,
        },
      }),
      {
        onSettled: () => onMutate(),
        onError: (err: Error) => {
          handleMutationError(err, notify)
          setHasError(true)
        },
      }
    )

    const { mutate: deleteFromDb } = useMutation(
      createMutationFn({
        url: `/api/bnet/character/${id}/delete`,
        method: 'DELETE',
      }),
      {
        onSuccess: () => onMutate(),
      }
    )

    const onToggleChange = useCallback(
      (checked) => {
        if (checked) {
          saveToDb()
        } else {
          deleteFromDb()
        }
      },
      [deleteFromDb, saveToDb]
    )

    return (
      <tr className={hasError ? 'opacity-50 pointer-events-none' : ''}>
        <td>
          <span className={`font-semibold text-class-${classId}`}>{name}</span>
        </td>
        <td>{level}</td>
        <td>{realm}</td>
        <td>{region?.toUpperCase()}</td>
        <td className="text-right">
          <div className={hasError ? 'opacity-0' : ''}>
            <ToggleButton
              variant="positive"
              size="small"
              checked={isActive}
              onChange={onToggleChange}
            />
          </div>
        </td>
      </tr>
    )
  }
)
