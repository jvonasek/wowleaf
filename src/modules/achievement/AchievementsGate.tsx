import { ReactNode } from 'react'

import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'

type AchievementsGateProps = {
  children?: ReactNode
}

export const AchievementsGate: React.FC<AchievementsGateProps> = ({
  children,
}) => {
  const { isSuccess } = useAchievementsQuery()

  if (isSuccess) {
    return <>{children}</>
  }

  return null
}
