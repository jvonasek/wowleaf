import { clamp } from 'ramda'
import cx from 'classnames'
import { memo, ReactNode, useEffect, useState } from 'react'

import { getHslColorByPercent, num } from '@/lib/utils'

export type ProgressBarProps = {
  label?: string | ReactNode
  total?: number
  value: number
  display?: 'values' | 'percent'
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
    isReverse = false,
    color = 'dynamic',
    formatter = num.format,
  }) => {
    const [percentage, setPercentage] = useState(0)

    useEffect(() => {
      const perc = Math.round(clamp(0, 100, (value * 100) / total))

      setPercentage(isReverse ? 100 - perc : perc)
    }, [isReverse, total, value])

    const current = clamp(0, total, value)

    const valueLabel = formatter
      ? `${formatter(current)} / ${formatter(total)}`
      : `${current} / ${total}`

    return (
      <div className="w-full">
        {!!label && label}
        <div className="flex items-center">
          <div className="h-2 w-full rounded-full bg-background">
            <div
              className={cx(`h-2 rounded-l-full transition-all`, {
                'rounded-r-full': percentage === 100,
                'bg-accent': color === 'accent',
              })}
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  color === 'dynamic'
                    ? getHslColorByPercent(percentage)
                    : undefined,
              }}
            ></div>
          </div>
          <span className="text-sm text-foreground-muted whitespace-nowrap font-bold ml-3 min-w-42">
            {display === 'values' ? (
              <span className="inline-block">{valueLabel}</span>
            ) : (
              <span className="inline-block w-10">{percentage}%</span>
            )}
          </span>
        </div>
      </div>
    )
  }
)
