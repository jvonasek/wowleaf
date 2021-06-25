import { useState } from 'react'
import { Switch } from '@headlessui/react'
import cx from 'classnames'
import { useCallback } from 'react'
import { CheckIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'

const VARIANT_MAP = {
  primary: 'bg-primary-2',
  positive: 'bg-positive',
  neutral: 'bg-neutral',
  negative: 'bg-negative',
}

const SIZE_MAP = {
  small: {
    body: 'h-[26px] w-[50px]',
    head: 'h-[22px] w-[22px]',
    icon: 'w-4 h-4 translate-x-[-24px]',
    headEnabled: 'translate-x-[24px]',
  },
  medium: {
    body: 'h-[32px] w-[62px]',
    head: 'h-[28px] w-[28px]',
    icon: 'w-5 h-5 translate-x-[-30px]',
    headEnabled: 'translate-x-[30px]',
  },
  large: {
    body: 'h-[38px] w-[74px]',
    head: 'h-[34px] w-[34px]',
    icon: 'w-6 h-6 translate-x-[-36px]',
    headEnabled: 'translate-x-[36px]',
  },
}

export type ToggleButtonVariant = keyof typeof VARIANT_MAP
export type ToggleButtonSize = keyof typeof SIZE_MAP

export type ToggleButtonProps = {
  variant?: ToggleButtonVariant
  size?: ToggleButtonSize
}

export const ToggleButton = ({
  size = 'medium',
  variant = 'primary',
  onChange,
  checked = false,
}) => {
  const [enabled, setEnabled] = useState(checked)

  const onToggle = useCallback(
    (checked) => {
      onChange(checked)
      setEnabled(checked)
    },
    [onChange]
  )

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={onToggle}
        className={cx(
          enabled ? VARIANT_MAP[variant] : 'bg-secondary-2',
          'relative overflow-hidden inline-flex flex-shrink-0 cursor-pointer',
          'border-2 border-transparent rounded-full',
          'transition-colors ease-in-out duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
          SIZE_MAP[size].body
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={cx(
            enabled ? SIZE_MAP[size].headEnabled : 'translate-x-0',
            'bg-white shadow-lg ring-0',
            'pointer-events-none inline-block rounded-full',
            'transform transition ease-in-out duration-200',
            'flex items-center justify-center',
            SIZE_MAP[size].head
          )}
        >
          <CheckIcon
            className={cx('text-white transform', SIZE_MAP[size].icon)}
          />
        </span>
      </Switch>
    </div>
  )
}