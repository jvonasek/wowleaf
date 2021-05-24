import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'
import { CharacterAchievements } from '@/modules/character/CharacterAchievements'
import { Faction } from '@/types'

export type AchievementListProps = {
  category?: string[]
  characterKey: string
  factionId: Faction
  isAggregated?: boolean
}
export const AchievementList: React.FC<AchievementListProps> = ({
  category,
  characterKey,
  factionId,
  isAggregated = false,
}) => (
  <div className="grid grid-cols-12 gap-7">
    <div className="col-span-3 bg-surface p-7 rounded-lg">
      <AchievementCategories
        basePath={isAggregated ? '/dashboard' : `/character/${characterKey}`}
      />
    </div>
    <div className="col-span-9 bg-surface p-7 rounded-lg">
      <CharacterAchievements
        isAggregated={isAggregated}
        category={category}
        characterKey={characterKey}
        factionId={factionId}
      />
    </div>
  </div>
)
