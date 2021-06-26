import { FaBattleNet } from 'react-icons/fa'

import { AuthProviders } from '@/components/AuthProviders'
import { Dialog } from '@/components/Dialog'
import { useAuthProviders } from '@/hooks/useAuthProviders'

import { useAuthDialogStore } from './store/useAuthDialogStore'

export const AuthDialog: React.FC = () => {
  const { isOpen, close } = useAuthDialogStore()
  const providers = useAuthProviders()
  return (
    <Dialog open={isOpen} size="medium" onClose={close} noContentPadding>
      <div className="grid grid-cols-5">
        <div className="col-span-1 bg-brand-battlenet/50 h-48 rounded-l-2xl p-6 flex items-center justify-center">
          <FaBattleNet className="h-16 w-16" />
        </div>
        <div className="col-span-4 flex items-center justify-center space-y-5">
          <AuthProviders providers={providers} size="large" />
        </div>
      </div>
    </Dialog>
  )
}
