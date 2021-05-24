import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { AchievementCategory } from '@/types'

export type AchievementCategoriesProps = {
  basePath: string
}

const ActiveLink = ({ children, href }) => {
  const router = useRouter()
  return (
    <Link href={href} passHref>
      <a className={router.asPath === href ? 'text-accent' : ''}>{children}</a>
    </Link>
  )
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = ({
  basePath,
}) => {
  const { isSuccess, data } = useQuery<AchievementCategory[]>(
    '/api/wow/categories/'
  )

  return (
    <div className="space-y-3">
      {isSuccess &&
        data.map(({ id, name, slug, otherAchievementCategories }) => (
          <div className="bg-surface p-3 rounded text-lg" key={id}>
            <ActiveLink href={`${basePath}/achievements/${slug}`}>
              {name}
            </ActiveLink>
            {otherAchievementCategories.length > 0 &&
              otherAchievementCategories.map(({ id, name, slug }) => (
                <div key={id} className="pl-4 text-sm">
                  <ActiveLink href={`${basePath}/achievements/${slug}`}>
                    {name}
                  </ActiveLink>
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}
