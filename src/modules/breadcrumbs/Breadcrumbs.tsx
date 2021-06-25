import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const Breadcrumbs = () => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState(null)

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.replace(/(?:\?|#).*/, '').split('/')
      linkPath.shift()

      const pathArray = linkPath.map((path, i) => {
        return {
          path,
          href: '/' + linkPath.slice(0, i + 1).join('/'),
        }
      })

      setBreadcrumbs(pathArray)
    }
  }, [router])

  if (!breadcrumbs) {
    return null
  }

  return (
    <nav aria-label="breadcrumbs" className="w-full text-foreground-muted">
      <ol className="block w-full">
        <li className="inline">
          <a href="/">Home</a>
          <span className="mx-2">/</span>
        </li>
        {breadcrumbs.map((breadcrumb, index) => {
          const isActive = index === breadcrumbs.length - 1
          return (
            <li
              key={breadcrumb.href}
              className={`inline ${
                isActive ? 'text-foreground' : 'text-foreground-muted'
              }`}
            >
              <Link href={breadcrumb.href}>
                <a>{breadcrumb.path}</a>
              </Link>
              {!isActive && (
                <span className="mx-2 text-foreground-muted">/</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
