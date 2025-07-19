import { motion } from 'framer-motion'
import { Highlighter, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal'

function Header() {
  const [showProfile, setShowProfile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      <motion.header 
        className="glass-effect sticky top-0 z-50 px-6 py-4 border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
              <Highlighter className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Keeper
            </h1>
          </motion.div>
          
          {isLoggedIn && (
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Profile</span>
              </motion.button>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.header>

      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  )
}

export default Header