import { motion } from 'framer-motion'
import CustomToast from './CustomToast'

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <CustomToast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export default ToastContainer