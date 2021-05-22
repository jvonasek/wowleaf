import {
  AchievementCard,
  AchievementCardProps,
} from '@/modules/achievement/AchievementCard'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Components/AchievementCard',
  component: AchievementCard,
} as Meta

const TheAchievementCard: Story<AchievementCardProps> = (
  args,
  { loaded: { achievement } }
) => {
  return <AchievementCard {...args} {...achievement} />
}

export const Default = TheAchievementCard.bind({})
Default.loaders = [
  async () => ({
    achievement: await fetch(
      'http://localhost:3000/api/wow/achievements/8728'
    ).then((res) => res.json()),
  }),
]
