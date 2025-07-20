import { motion } from 'framer-motion'

function ProfileAvatar({ name, size = 'md', className = '' }) {
  // Extract initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  // Generate consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-500'
    
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  }

  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {initials}
    </motion.div>
  )
}

export default ProfileAvatar