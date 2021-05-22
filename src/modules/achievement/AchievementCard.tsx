import cx from 'classnames'
import { memo, useMemo, useState } from 'react'

import { Button } from '@/components/Button'
import { DateTime } from '@/components/DateTime'
import { Dialog } from '@/components/Dialog'
import { ProgressBar } from '@/components/ProgressBar'
import { getHslColorByPercent } from '@/lib/utils'
import { useCharacterAchievementsStore } from '@/modules/character/store/useCharacterAchievementsStore'
import { useCharacterStore } from '@/modules/character/store/useCharacterStore'
import { ArrowSmRightIcon, CheckIcon, StarIcon } from '@heroicons/react/solid'
import { IS_PREMIUM } from '@/lib/constants'

import { AchievementCriteriaList } from './AchievementCriteriaList'
import { Achievement } from './types'

export type AchievementCardProps = Achievement

export const AchievementCard: React.FC<Achievement> = memo(
  ({
    id,
    name,
    description,
    criteria,
    rewardDescription,
    rewardItemId,
    achievementAssets,
    isAccountWide,
    points,
  }) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { characterKey } = useCharacterStore()

    const { getProgress } = useCharacterAchievementsStore()

    function closeDialog() {
      setDialogOpen(false)
    }

    function openDialog() {
      setDialogOpen(true)
    }

    const {
      percent,
      partial,
      required,
      isCompleted,
      completedTimestamp,
      showOverallProgressBar,
      criteria: criteriaProgress,
      characterKey: achievementCharacterKey,
    } = useMemo(() => getProgress(id, characterKey, IS_PREMIUM), [
      id,
      characterKey,
      getProgress,
    ])

    return (
      <>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 flex items-center">
            {achievementAssets && achievementAssets[0] && (
              <div className="relative mr-5">
                <span
                  className={cx(
                    'block p-0.5 border-2 w-16 h-16 rounded-xl',
                    isCompleted ? 'border-positive' : 'border-background'
                  )}
                >
                  <img
                    src={achievementAssets[0].value}
                    width={56}
                    height={56}
                    alt={name}
                    className="rounded-lg"
                  />
                  {isCompleted && (
                    <span
                      className={cx(
                        'flex items-center justify-center',
                        'absolute top-0 left-0 w-7 h-7',
                        'transform -translate-x-1/4 -translate-y-1/4',
                        'border-2 border-positive',
                        'bg-surface text-positive rounded-full'
                      )}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </span>
                  )}
                </span>
              </div>
            )}
            <div>
              <span>{name}</span>
              <span className="block text-sm text-foreground-muted">
                {description}{' '}
              </span>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            {rewardDescription && (
              <span className="block">
                {rewardItemId ? (
                  <a
                    href={`https://www.wowhead.com/item=${rewardItemId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-11 h-11 border-current border-2 p-0.5 rounded-lg overflow-hidden"
                    data-wh-icon-size="medium"
                    data-wh-rename-link="false"
                  />
                ) : (
                  <span
                    className="flex items-center text-foreground-muted justify-center w-11 h-11 border-2 rounded-lg"
                    title={rewardDescription}
                  >
                    <StarIcon className="w-5 h-5" />
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="col-span-3 flex items-center">
            <div className="w-full">
              <span>{achievementCharacterKey}</span>
              <div className="flex items-center">
                <div className="h-2 w-full rounded-full bg-background">
                  <div
                    className={`h-2 rounded-l-full${
                      percent === 100 ? ' rounded-r-full' : ''
                    }`}
                    style={{
                      width: `${percent}%`,
                      backgroundColor: getHslColorByPercent(percent),
                    }}
                  ></div>
                </div>
                <span className="text-sm text-foreground-muted ml-3 w-12">
                  {percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="flex font-bold items-center text-foreground-muted justify-center w-11 h-11 border-2 rounded-full">
              {points}
            </span>
          </div>
          <div className="col-span-1 flex items-center justify-end">
            <Button variant="secondary" onClick={openDialog}>
              <ArrowSmRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Dialog
          title={name}
          description={description}
          open={dialogOpen}
          onClose={closeDialog}
          size="large"
        >
          {showOverallProgressBar && (
            <ProgressBar value={partial} total={required} />
          )}
          <AchievementCriteriaList
            criteria={criteria}
            criteriaProgress={criteriaProgress}
          />
          <AchievementMetaData
            id={id}
            isAccountWide={isAccountWide}
            isCompleted={isCompleted}
            percent={percent}
            completedTimestamp={completedTimestamp}
          />
        </Dialog>
      </>
    )
  }
)

function AchievementMetaData({
  id,
  isAccountWide,
  isCompleted,
  percent,
  completedTimestamp,
}) {
  return (
    <div className="space-x-3 text-sm text-foreground-muted mt-3">
      <span>[{id}]</span>
      {isAccountWide && <span>[ACCOUNT WIDE]</span>}
      {isCompleted && percent !== 100 && (
        <span>[COMPLETED ON ANOTHER CHAR]</span>
      )}
      {completedTimestamp && (
        <span>
          [<DateTime date={new Date(completedTimestamp)} />]
        </span>
      )}
      <span>
        [
        <a
          href={`https://www.wowhead.com/achievement=${id}`}
          target="_blank"
          rel="noreferrer"
        >
          wowhead.com
        </a>
        ]
      </span>
    </div>
  )
}
