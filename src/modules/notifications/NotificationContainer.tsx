import { Toast } from '@/components/Toast'
import { Transition } from '@headlessui/react'

import { useNotificationStore } from './store/useNotificationStore'

export const NotificationContainer: React.FC = () => {
  const { notifications, dismiss } = useNotificationStore()

  return (
    <div className="fixed z-50 top-0 right-0 space-y-5 p-5">
      {notifications.map((props) => (
        <Transition
          key={props.id}
          appear
          show
          enter="transform transition-all duration-500 ease-out-back"
          enterFrom="opacity-0 translate-x-full"
          enterTo="opacity-100 translate-x-0"
        >
          <Toast {...props} onDismiss={dismiss} />
        </Transition>
      ))}
    </div>
  )
}
