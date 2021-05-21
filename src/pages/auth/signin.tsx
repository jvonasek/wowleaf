import { NextPage } from 'next';
import { providers } from 'next-auth/client';

import { AuthProviders } from '@/components/AuthProviders';
import { SessionProviders } from '@/types';

export type SignInProps = {
  providers: SessionProviders
}

const SignIn: NextPage<SignInProps> = ({ providers }) => (
  <div>
    <AuthProviders providers={providers} />
  </div>
)

export default SignIn

SignIn.getInitialProps = async () => {
  return {
    providers: await providers(),
  }
}
