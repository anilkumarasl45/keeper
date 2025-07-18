import { motion } from 'framer-motion'
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import axios from "axios"
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'
import GoogleLoginButton from '../components/GoogleLoginButton'
import PhoneLoginModal from '../components/PhoneLoginModal'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPhoneLogin, setShowPhoneLogin] = useState(false)
    const { toasts, toast, removeToast } = useToast()

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        
        const email = emailRef.current.value
        const password = passwordRef.current.value
        
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER_API}/login`,
                { email, password },
                { withCredentials: true }
            )

            if (data.success === true) {
                localStorage.setItem("token", data.token)
                toast.success("Welcome back!")
                setTimeout(() => {    
                    navigate('/')
                }, 1000)
            } else {
                toast.error("Invalid credentials!")
            }
        } catch (error) {
            console.log("Login error:", error)
            toast.error("Something went wrong!")
        }
        
        setIsLoading(false)
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <motion.div 
                    className="glass-effect rounded-3xl p-10 w-full max-w-lg shadow-2xl border border-white/20"
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
                        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</h1>
                        <p className="text-gray-600 text-lg">Sign in to your account</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-base font-medium text-gray-700 mb-3">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                ref={emailRef}
                                type="email"
                                required
                                className="input-field text-lg py-4"
                                placeholder="Enter your email"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-base font-medium text-gray-700 mb-3">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field text-lg py-4 pr-14"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <LogIn className="w-6 h-6" />
                            )}
                            <span className="font-semibold">{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        </motion.button>
                    </form>

                    <motion.div 
                        className="mt-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-base">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <GoogleLoginButton />
                            
                            <button
                                type="button"
                                onClick={() => setShowPhoneLogin(true)}
                                className="btn-secondary w-full flex items-center justify-center space-x-2 py-4 text-lg"
                            >
                                <span className="text-xl">📱</span>
                                <span className="font-medium">Continue with Phone</span>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="mt-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <p className="text-gray-600 text-lg">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            <PhoneLoginModal 
                isOpen={showPhoneLogin}
                onClose={() => setShowPhoneLogin(false)}
            />
            
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    )
}

export default Login