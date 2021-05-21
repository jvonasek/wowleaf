import { signIn, signOut, useSession } from 'next-auth/client';

import { Button } from './Button';

export const HeaderLogin: React.FC = (): JSX.Element => {
  const [session, loading] = useSession()

  return (
    <div hidden={loading} className="flex align-middle">
      {!session && (
        <Button className="inline-block" size="small" onClick={signIn}>
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
