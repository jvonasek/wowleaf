import { signIn, signOut, useSession } from 'next-auth/client'

import { Button } from '@/components/Button'
import { useAuthDialogStore } from '@/modules/auth/store/useAuthDialogStore'

export const HeaderLogin: React.FC = (): JSX.Element => {
  const [session, loading] = useSession()
  const { open } = useAuthDialogStore()

  return (
    <div hidden={loading} className="flex align-middle">
      {!session && (
        <Button className="inline-block" size="small" onClick={open}>
          Sign in
        </Button>
      )}
      {session && (
        <>
          <span className="text-sm mr-2 self-center">{session.user.name}</span>
          <Button
            size="small"
            className="inline-block ml-2"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  )
}
