import { useState } from 'react'
import { DateTime } from '@/components/DateTime'
import { Disclosure } from '@headlessui/react'
import cx from 'classnames'
import { ArrowSmRightIcon, StarIcon } from '@heroicons/react/solid'

import { AchievementCriterion } from '@/components/AchievementCriterion'

import { Button } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import { Achievement, AchievementWithProgress } from '@/types'
import { getHslColorByPercent } from '@/lib/utils'

export type AchievementCardProps = Achievement

export const AchievementCard: React.FC<AchievementWithProgress> = ({
  id,
  name,
  description,
  isCompleted,
  completedTimestamp,
  criteria,
  progress,
  isAccountWide,
  rewardDescription,
  rewardItemId,
  achievementAssets,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  function closeDialog() {
    setDialogOpen(false)
  }

  function openDialog() {
    setDialogOpen(true)
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 flex items-center">
          {achievementAssets && achievementAssets[0] && (
            <img
              src={achievementAssets[0].value}
              width={56}
              height={56}
              alt={name}
              className="rounded-lg mr-5"
            />
          )}
          <div>
            <span
              className={cx('font-bold', {
                'text-positive': isCompleted,
              })}
            >
              {name}
            </span>
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
                  className="block border-2 p-0.5 rounded-lg overflow-hidden"
                  data-wh-icon-size="medium"
                  data-wh-rename-link="false"
                ></a>
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
            <div className="flex items-center">
              <div className="h-2 w-full rounded-full bg-background">
                <div
                  className="h-2 rounded-l-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: getHslColorByPercent(progress),
                  }}
                ></div>
              </div>
              <span className="text-sm text-foreground-muted ml-3 w-12">
                {progress}%
              </span>
            </div>
          </div>
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
        {!!criteria?.childCriteria.length && (
          <div className="grid grid-cols-2 text-sm leading-8">
            {criteria.childCriteria.map((criterion) => (
              <AchievementCriterion key={criterion.id} {...criterion} />
            ))}
          </div>
        )}
        <div className="space-x-3 text-sm text-foreground-muted mt-3">
          <span>[{id}]</span>
          {isAccountWide && <span>[ACCOUNT WIDE]</span>}
          {isCompleted && progress !== 100 && (
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
      </Dialog>
    </>
  )
}
