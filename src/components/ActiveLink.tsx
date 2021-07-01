import Link from 'next/link'
import { useRouter } from 'next/router'

export const ActiveLink = ({
  children,
  href,
}: {
  href: string
  children(isActive: boolean): React.ReactNode
}) => {
  const router = useRouter()
  const isActive = router.asPath.startsWith(href)
  return (
    <Link href={href} passHref>
      {children(isActive)}
    </Link>
  )
}
