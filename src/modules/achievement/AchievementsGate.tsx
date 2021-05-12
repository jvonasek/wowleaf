import { ReactNode } from 'react'

import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'

type AchievementsGateProps = {
  category?: string[]
  children?: ReactNode
}

export const AchievementsGate: React.FC<AchievementsGateProps> = ({
  category,
  children,
}) => {
  const { isSuccess } = useAchievementsQuery({
    category,
  })

  if (isSuccess) {
    return <>{children}</>
  }

  return null
}
