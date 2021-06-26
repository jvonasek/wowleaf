import { Toast } from '@/components/Toast'
import { Transition } from '@headlessui/react'

import { useNotificationStore } from './store/useNotificationStore'

export const NotificationContainer: React.FC = () => {
  const { notifications, dismiss } = useNotificationStore()

  return (
    <div className="fixed z-50 top-0 right-0 p-5">
      {notifications.map((props) => (
        <Transition
          key={props.id}
          appear
          show={props.visible}
          enter="transform transition-all duration-500 ease-out-back"
          enterFrom="opacity-0 translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="transform transition-all duration-500 ease-out overflow-hidden"
          leaveFrom="opacity-100 max-h-24"
          leaveTo="opacity-0 max-h-0"
        >
          <div className="pb-4">
            <Toast {...props} onDismiss={dismiss} />
          </div>
        </Transition>
      ))}
    </div>
  )
}
