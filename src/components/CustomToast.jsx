import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    iconColor: 'text-white'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
    iconColor: 'text-white'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    iconColor: 'text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    iconColor: 'text-white'
  }
}

function CustomToast({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const toastConfig = toastTypes[toast.type] || toastTypes.info
  const Icon = toastConfig.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(toast.id), 300)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          className={`${toastConfig.bgColor} backdrop-blur-sm rounded-2xl shadow-2xl p-4 mb-3 max-w-sm w-full border border-white/20`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon className={`w-6 h-6 ${toastConfig.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(toast.id), 300)
              }}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CustomToast