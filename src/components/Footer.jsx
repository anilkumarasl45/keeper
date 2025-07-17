import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <motion.footer 
      className="glass-effect mt-auto py-6 px-6 border-t border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.p 
          className="text-gray-600 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <span>Made with</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </motion.div>
          <span>by Harsh Sharma © {year}</span>
        </motion.p>
      </div>
    </motion.footer>
  )
}

export default Footer