import { clamp } from 'ramda'
import cx from 'classnames'
import { memo, ReactNode, useMemo } from 'react'

import { getHslColorByPercent, percentage, num } from '@/lib/utils'

export type ProgressBarProps = {
  label?: string | ReactNode
  total?: number
  value: number
  precision?: number
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
    precision = 1,
    display = 'percent',
    displayPosition = 'right',
    isReverse = false,
    color = 'dynamic',
    formatter = num.format,
  }) => {
    const percent = useMemo(() => {
      const perc = clamp(0, 100, percentage(value, total, precision))
      return isReverse ? 100 - perc : perc
    }, [isReverse, precision, total, value])

    const current = clamp(0, total, value)

    const valueLabel = formatter
      ? `${formatter(current)} / ${formatter(total)}`
      : `${current} / ${total}`

    const background = useMemo(() => {
      return color === 'dynamic'
        ? `linear-gradient(to right, ${getHslColorByPercent(
            percent
          )}, ${getHslColorByPercent(percent, 70, 60)})`
        : undefined
    }, [color, percent])

    return (
      <div className="w-full">
        {!!label && label}
        <div className="flex items-center">
          <div
            className={cx('h-2 w-full rounded-full bg-surface-2', {
              'order-2 ml-3': displayPosition === 'left',
              'mr-3': displayPosition === 'right',
            })}
          >
            <div
              className={cx(`h-2 rounded-l-full transition-all`, {
                'rounded-r-full': percent === 100,
                'bg-primary-2': color === 'accent',
              })}
              style={{
                width: `${percent}%`,
                background,
              }}
            ></div>
          </div>
          <span className="text-sm text-foreground-muted whitespace-nowrap font-bold min-w-42">
            {display === 'values' ? (
              <span className="inline-block">{valueLabel}</span>
            ) : (
              <span className="inline-block w-10">
                {percent.toFixed(percent > 0 ? precision : 0)}%
              </span>
            )}
          </span>
        </div>
      </div>
    )
  }
)
