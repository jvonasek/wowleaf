import cx from 'classnames'
import { memo, useMemo, useState } from 'react'

import { Button } from '@/components/Button'
import { DateTime } from '@/components/DateTime'
import { Dialog } from '@/components/Dialog'
import { ProgressBar } from '@/components/ProgressBar'
import { Tooltip } from '@/components/Tooltip'
import { useCharacterAchievementsStore } from '@/modules/character/store/useCharacterAchievementsStore'
import { useCharacterStore } from '@/modules/character/store/useCharacterStore'
import { Character } from '@/types'
import { ArrowSmRightIcon, CheckIcon, StarIcon } from '@heroicons/react/solid'
import { getHslColorByPercent } from '@/lib/utils'
import { EXPANSION_MAP } from '@/lib/constants'

import { AchievementCriteriaList } from './AchievementCriteriaList'
import { Achievement } from './types'
import { prop, uniqBy } from 'ramda'

export type AchievementCardProps = {
  isProgressAggregated: boolean
} & Achievement

export type CharacterLine = Character & {
  className?: string
  percent?: number
}

const CharacterLine: React.FC<CharacterLine> = ({
  classId,
  name,
  percent = null,
  className,
}) => {
  return (
    <span
      className={cx(className, {
        [`text-class-${classId}`]: !!classId,
      })}
    >
      <span>{name}</span>
      {Number.isFinite(percent) && (
        <span className="ml-5" style={{ color: getHslColorByPercent(percent) }}>
          {percent}%
        </span>
      )}
    </span>
  )
}

export const AchievementCard: React.FC<AchievementCardProps> = memo(
  ({
    id,
    name,
    description,
    criteria,
    rewardDescription,
    rewardItemId,
    achievementAssets,
    isAccountWide,
    factionId,
    expansionId,
    isProgressAggregated = false,
  }) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { characterKey } = useCharacterStore()

    const {
      getCharAchievementProgressById,
      getAggregatedProgressOrderById,
      getCharacterInfo,
    } = useCharacterAchievementsStore()

    function closeDialog() {
      setDialogOpen(false)
    }

    function openDialog() {
      setDialogOpen(true)
    }

    const charKey = isProgressAggregated ? 'aggregated' : characterKey

    const {
      percent,
      partial,
      required,
      isCompleted,
      completedTimestamp,
      showOverallProgressBar,
      criteria: criteriaProgress,
    } = useMemo(() => getCharAchievementProgressById(id, charKey), [
      getCharAchievementProgressById,
      id,
      charKey,
    ])

    const characters = getAggregatedProgressOrderById(id)
    const topCharacter =
      characters && !!characters.length
        ? getCharacterInfo(characters[0].characterKey)
        : null

    const criteriaFilteredByFaction = useMemo(() => {
      if (topCharacter) {
        return criteria.filter(
          ({ factionId }) => !factionId || factionId === topCharacter.faction
        )
      }
      return criteria
    }, [criteria, topCharacter])

    const isProgressIndeterminate =
      characters.length > 1
        ? uniqBy(prop('percent'))(characters)?.length <= 1
        : false

    /* if (isProgressIndeterminate) {
      console.log({
        id,
        name,
        characters,
        isProgressIndeterminate,
      })
    } */

    const progressBarLabel = useMemo(() => {
      if (isProgressAggregated) {
        if (isCompleted) {
          return <span className="font-bold text-sm">Completed!</span>
        }

        return (
          <span className="font-bold text-sm">
            {factionId && (
              <span
                className={cx({
                  ['text-blue-500']: factionId === 'ALLIANCE',
                  ['text-red-500']: factionId === 'HORDE',
                })}
              >
                {factionId === 'ALLIANCE' ? 'A ' : 'H '}
              </span>
            )}
            {isAccountWide ? (
              <span className="text-foreground-muted opacity-50">
                Account Wide
              </span>
            ) : (
              <span>
                {isProgressIndeterminate && (
                  <span className="text-foreground-muted opacity-50">
                    Indeterminate
                  </span>
                )}
                {topCharacter && !isProgressIndeterminate && (
                  <Tooltip
                    placement="left"
                    overlay={
                      <div className="block space-y-2">
                        {characters.map(({ characterKey, percent }) => (
                          <CharacterLine
                            key={characterKey}
                            percent={percent}
                            className="flex font-bold justify-between w-full"
                            {...getCharacterInfo(characterKey)}
                          />
                        ))}
                      </div>
                    }
                  >
                    <CharacterLine {...topCharacter} />
                    {characters.length > 1 && (
                      <span className="text-yellow-400">
                        {' '}
                        +{characters.length - 1}
                      </span>
                    )}
                  </Tooltip>
                )}
              </span>
            )}
          </span>
        )
      }

      return null
    }, [
      characters,
      factionId,
      getCharacterInfo,
      isAccountWide,
      isCompleted,
      isProgressAggregated,
      isProgressIndeterminate,
      topCharacter,
    ])

    return (
      <>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 flex items-center">
            {achievementAssets && achievementAssets[0] && (
              <div className="relative mr-5">
                <span
                  className={cx(
                    'w-16 h-16 block border-2 bg-background-darker p-0.5 rounded-xl',
                    isCompleted ? 'border-positive' : 'border-accent-alt'
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
                        'bg-background-darker text-positive rounded-full'
                      )}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </span>
                  )}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg">{name}</h3>
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
                  <Tooltip overlay={rewardDescription}>
                    <span className="flex items-center text-foreground-muted justify-center w-11 h-11 border-2 rounded-lg">
                      <StarIcon className="w-5 h-5" />
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </div>
          <div className="col-span-3 flex items-center">
            <ProgressBar
              value={isCompleted ? 100 : percent}
              total={100}
              label={progressBarLabel}
            />
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
            criteria={criteriaFilteredByFaction}
            criteriaProgress={criteriaProgress}
            isProgressAggregated={isProgressAggregated}
          />
          <AchievementMetaData
            id={id}
            isAccountWide={isAccountWide}
            isCompleted={isCompleted}
            percent={percent}
            completedTimestamp={completedTimestamp}
            expansionId={expansionId}
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
  expansionId,
}) {
  return (
    <div className="space-x-3 text-sm text-foreground-muted mt-3">
      <span>[{id}]</span>
      <span>[{EXPANSION_MAP[expansionId]}]</span>
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
