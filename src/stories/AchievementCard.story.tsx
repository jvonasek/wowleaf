import { Story, Meta } from '@storybook/react'

import {
  AchievementCard,
  AchievementCardProps,
} from '@/modules/achievement/AchievementCard'

export default {
  title: 'Components/AchievementCard',
  component: AchievementCard,
} as Meta

const TheAchievementCard: Story<AchievementCardProps> = (
  args,
  { loaded: { achievement } }
) => {
  console.log(achievement)
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
