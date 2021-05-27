import { clamp } from 'ramda'
import cx from 'classnames'
import { memo, ReactNode, useMemo } from 'react'

import { getHslColorByPercent, percentage, num } from '@/lib/utils'

export type ProgressBarProps = {
  label?: string | ReactNode
  total?: number
  value: number
  display?: 'values' | 'percent'
  displayPosition?: 'left' | 'right'
  color?: 'dynamic' | 'accent'
  isReverse?: boolean
  formatter?: (n: number) => string
}

export const ProgressBar: React.FC<ProgressBarProps> = memo(
  ({
    label,
    total = 100,
    value = 0,
    display = 'percent',
    displayPosition = 'right',
    isReverse = false,
    color = 'dynamic',
    formatter = num.format,
  }) => {
    const percent = useMemo(() => {
      const perc = clamp(0, 100, percentage(value, total))
      return isReverse ? 100 - perc : perc
    }, [isReverse, total, value])

    const current = clamp(0, total, value)

    const valueLabel = formatter
      ? `${formatter(current)} / ${formatter(total)}`
      : `${current} / ${total}`

    return (
      <div className="w-full">
        {!!label && label}
        <div className="flex items-center">
          <div
            className={cx('h-2 w-full rounded-full bg-background', {
              'order-2 ml-3': displayPosition === 'left',
              'mr-3': displayPosition === 'right',
            })}
          >
            <div
              className={cx(`h-2 rounded-l-full transition-all`, {
                'rounded-r-full': percent === 100,
                'bg-accent': color === 'accent',
              })}
              style={{
                width: `${percent}%`,
                backgroundColor:
                  color === 'dynamic'
                    ? getHslColorByPercent(percent)
                    : undefined,
              }}
            ></div>
          </div>
          <span className="text-sm text-foreground-muted whitespace-nowrap font-bold min-w-42">
            {display === 'values' ? (
              <span className="inline-block">{valueLabel}</span>
            ) : (
              <span className="inline-block w-10">{percent}%</span>
            )}
          </span>
        </div>
      </div>
    )
  }
)
