import { useQuery } from 'react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const AchievementCategories: React.FC = () => {
  const router = useRouter()

  const {
    category,
    parentId = category?.[0],
    categoryId = category?.[1],
  } = router.query

  const isCategoryIndex = true //!!parentId && !!categoryId

  const { isSuccess, data } = useQuery(
    'WoWAchievementCategories',
    () =>
      fetch(
        isCategoryIndex
          ? `/api/wow/categories/`
          : `/api/wow/categories/${categoryId || parentId}`
      ).then((res) => res.json()),
    {
      enabled: isCategoryIndex, // || !!(categoryId || parentId),
    }
  )

  return (
    <div className="space-y-3">
      {isSuccess &&
        !!data.length &&
        data.map(({ id, name }) => (
          <div className="bg-surface p-3 rounded" key={id}>
            <Link href={`${router.asPath}/achievements/${id}`}>{name}</Link>
          </div>
        ))}
    </div>
  )
}
