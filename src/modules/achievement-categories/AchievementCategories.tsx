import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { useCharacterStore } from '@/modules/character/store/useCharacterStore';

export type AchievementCategoriesProps = {
  category?: string[]
}

const ActiveLink = ({ children, href }) => {
  const router = useRouter()
  return (
    <Link href={href} passHref>
      <a className={router.asPath === href ? 'text-accent' : ''}>{children}</a>
    </Link>
  )
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = () => {
  const { characterKey } = useCharacterStore()

  const { isSuccess, data } = useQuery('/api/wow/categories/')

  return (
    <div className="space-y-3">
      {data && <strong>{data.name}</strong>}
      {isSuccess &&
        data.map(({ id, name, slug, otherAchievementCategories }) => (
          <div className="bg-surface p-3 rounded text-lg" key={id}>
            <ActiveLink
              href={`/character/${characterKey}/achievements/${slug}`}
            >
              {name}
            </ActiveLink>
            {otherAchievementCategories.length > 0 &&
              otherAchievementCategories.map(({ id, name, slug }) => (
                <div key={id} className="pl-4 text-sm">
                  <ActiveLink
                    href={`/character/${characterKey}/achievements/${slug}`}
                  >
                    {name}
                  </ActiveLink>
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}
