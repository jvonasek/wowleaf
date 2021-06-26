import { memo, useCallback, useState, useEffect } from 'react'
import { useMutation, useIsMutating } from 'react-query'

import { Spinner } from '@/components/Spinner'
import { ToggleButton } from '@/components/ToggleButton'
import { createMutationFn } from '@/lib/createMutationFn'
import { MAX_ALLOWED_CHARACTERS } from '@/lib/constants'
import {
  NotifyFn,
  useNotificationStore,
} from '@/modules/notifications/store/useNotificationStore'
import { Character } from '@/types'
import { Boom, isBoom } from '@hapi/boom'

export type CharacterSelectRowProps = Character & {
  isActive: boolean
  onMutate: () => void
}

const handleMutationError = (err: Boom, notify: NotifyFn) => {
  if (isBoom(err)) {
    const dangerErrors = [404]
    notify({
      type: dangerErrors.includes(err.output.payload.statusCode)
        ? 'danger'
        : 'info',
      content: err.output.payload.message,
    })
  }
}

export const CharacterSelectRow: React.FC<CharacterSelectRowProps> = memo(
  ({ id, name, level, classId, region, realm, isActive = false, onMutate }) => {
    const [hasError, setHasError] = useState(false)
    const notify = useNotificationStore((state) => state.notify)
    const isMutating =
      useIsMutating({ mutationKey: 'SaveCharacterMutation' }) > 0

    useEffect(() => {
      let timeout = null

      if (hasError) {
        timeout = setTimeout(() => {
          setHasError(false)
        }, 2000)
      }

      return () => clearTimeout(timeout)
    }, [hasError])

    const { isLoading, mutate: saveToDb } = useMutation(
      createMutationFn({
        url: `/api/bnet/character/${id}`,
        method: 'PUT',
        errorMessages: {
          404: `Character ${name} wasn't found on BattleNet. Try relogging the character in World of Warcraft.`,
          405: `Character limit reached. You can select up to ${MAX_ALLOWED_CHARACTERS} characters.`,
        },
      }),
      {
        mutationKey: 'SaveCharacterMutation',
        onSettled: () => onMutate(),
        onError: (err: Boom) => {
          setHasError(true)
          handleMutationError(err, notify)
        },
        onSuccess: () => {
          notify({
            type: 'success',
            content: `Character ${name} has been added.`,
          })
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
        <td>
          <div className="flex items-center justify-end relative h-7">
            {isLoading && <Spinner className="ml-2 absolute left-full" />}
            {!hasError && (
              <ToggleButton
                variant={isLoading ? 'neutral' : 'positive'}
                size="small"
                checked={isActive}
                onChange={onToggleChange}
                disabled={isMutating}
              />
            )}
          </div>
        </td>
      </tr>
    )
  }
)
