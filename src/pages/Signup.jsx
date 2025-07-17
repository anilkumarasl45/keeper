import { motion } from 'framer-motion'
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'
import GoogleLoginButton from '../components/GoogleLoginButton'
import PhoneLoginModal from '../components/PhoneLoginModal'

function Signup() {
    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPhoneLogin, setShowPhoneLogin] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        
        const email = emailInputRef.current.value
        const password = passwordInputRef.current.value
        
        const toastId = toast.loading('Creating your account...')
        
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER_API}/signup`,
                { email, password },
                { withCredentials: true }
            )

            toast.dismiss(toastId)
            
            if (data.success === true) {
                localStorage.setItem("token", data.token)
                toast.success("Account created successfully!", {
                    position: "bottom-right",
                })     
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            } else {
                toast.error("Error creating account!", {
                    position: "bottom-right",
                })
            }
        } catch (error) {
            toast.dismiss(toastId)
            console.log("Signup error:", error)
            toast.error("Something went wrong!", {
                position: "bottom-right",
            })
        }
        
        setIsLoading(false)
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <motion.div 
                    className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="text-center mb-8"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join us and start organizing your notes</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                required
                                className="input-field"
                                placeholder="Enter your email"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    ref={passwordInputRef}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field pr-12"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                        </motion.button>
                    </form>

                    <motion.div 
                        className="mt-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <GoogleLoginButton />
                            
                            <button
                                type="button"
                                onClick={() => setShowPhoneLogin(true)}
                                className="btn-secondary w-full flex items-center justify-center space-x-2"
                            >
                                <span>📱</span>
                                <span>Continue with Phone</span>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            <PhoneLoginModal 
                isOpen={showPhoneLogin}
                onClose={() => setShowPhoneLogin(false)}
            />
            
            <Toaster />
        </>
    )
}

export default Signup