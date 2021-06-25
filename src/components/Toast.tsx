import cx from 'classnames'
import { useCallback } from 'react'

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XIcon,
} from '@heroicons/react/outline'

import { usePausableTimer } from '@/hooks/usePausableTimer'

const TYPE_MAP = {
  info: 'bg-primary-2',
  warning: 'bg-neutral',
  success: 'bg-positive',
  danger: 'bg-negative',
}

export type ToastProps = {
  id: string
  content: string
  type: keyof typeof TYPE_MAP
  autoDismissAfter?: number
  onDismiss: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
  id,
  content,
  type,
  onDismiss,
  autoDismissAfter = 7000,
}) => {
  const dismissSelf = useCallback(() => onDismiss?.(id), [id, onDismiss])
  const [pause, resume] = usePausableTimer(dismissSelf, autoDismissAfter)

  const icon = {
    info: <InformationCircleIcon className="w-6 h-6" />,
    warning: <ExclamationCircleIcon className="w-6 h-6" />,
    success: <CheckCircleIcon className="w-6 h-6" />,
    danger: <ExclamationCircleIcon className="w-6 h-6" />,
  }

  return (
    <div
      className="w-80 flex group"
      onMouseEnter={() => pause()}
      onMouseLeave={() => resume()}
    >
      <div
        className={cx(
          'text-on-positive rounded-l-lg flex items-center justify-center w-14',
          TYPE_MAP[type]
        )}
      >
        {icon[type]}
      </div>
      <div
        className={cx(
          'relative flex items-center w-full py-4 px-6',
          'bg-surface-1 text-foreground dark:bg-tertiary-3 dark:text-on-tertiary',
          'text-sm rounded-r-lg shadow-lg'
        )}
      >
        <span className="leading-relaxed">{content}</span>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className={cx(
            'absolute top-0 right-0 rounded-full',
            'w-7 h-7 opacity-0',
            'transform translate-x-1/4 -translate-y-1/4',
            'flex items-center justify-center',
            'bg-tertiary-3 text-white',
            'dark:bg-white dark:text-tertiary-3',
            'focus:outline-none group-hover:opacity-100'
          )}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
