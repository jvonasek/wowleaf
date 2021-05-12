import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Link from 'next/link'

export type AchievementCategoriesProps = {
  category?: string[]
  basePath?: string
}

export const AchievementCategories: React.FC<AchievementCategoriesProps> = ({
  category,
  basePath = '',
}) => {
  const [categories, setCategories] = useState([])

  const isRoot = !category

  const { isSuccess, data } = useQuery(
    ['WoWAchievementCategories', category || 'index'],
    () =>
      fetch(
        `/api/wow/categories/${(category && category.join('/')) || ''}`
      ).then((res) => res.json())
  )

  useEffect(() => {
    if (isSuccess && data) {
      const categoryList = isRoot ? data : data.otherAchievementCategories
      setCategories(categoryList)
    }
  }, [isSuccess, data, setCategories, isRoot])

  return (
    <div className="space-y-3">
      {data && <strong>{data.name}</strong>}
      {isSuccess &&
        categories.map(({ id, name, slug }) => (
          <div className="bg-surface p-3 rounded" key={id}>
            <Link href={`/${basePath}/achievements/${slug}`}>{name}</Link>
          </div>
        ))}
    </div>
  )
}
