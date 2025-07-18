import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Phone, Shield, User, Mail, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = {
  PHONE: 'phone',
  OTP: 'otp',
  DETAILS: 'details'
}

function PhoneLoginModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(STEPS.PHONE)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [userDetails, setUserDetails] = useState({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(STEPS.OTP)
    }, 1500)
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(STEPS.DETAILS)
    }, 1500)
  }

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      // Navigate to home or show success
    }, 1500)
  }

  const resetModal = () => {
    setCurrentStep(STEPS.PHONE)
    setPhoneNumber('')
    setOtp(['', '', '', '', '', ''])
    setUserDetails({ name: '', email: '' })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const renderPhoneStep = () => (
    <motion.div
      key="phone"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Enter Phone Number</h2>
        <p className="text-gray-600 text-lg">We'll send you a verification code</p>
      </div>

      <form onSubmit={handlePhoneSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-4 py-4 border border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-lg"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+86">🇨🇳 +86</option>
            <option value="+81">🇯🇵 +81</option>
          </select>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            className="flex-1 input-field text-lg py-4"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !phoneNumber}
          className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
          <span className="font-semibold">{isLoading ? 'Sending...' : 'Send Code'}</span>
        </button>
      </form>
    </motion.div>
  )

  const renderOtpStep = () => (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Verify Code</h2>
        <p className="text-gray-600 text-lg">
          Enter the 6-digit code sent to<br />
          <span className="font-semibold">{countryCode} {phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center space-x-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              maxLength={1}
            />
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCurrentStep(STEPS.PHONE)}
            className="btn-secondary flex items-center space-x-2 py-4 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <button
            type="submit"
            disabled={isLoading || otp.some(digit => !digit)}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 py-4 text-lg"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
            <span className="font-semibold">{isLoading ? 'Verifying...' : 'Verify'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  )

  const renderDetailsStep = () => (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Complete Profile</h2>
        <p className="text-gray-600 text-lg">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={handleDetailsSubmit} className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
            className="input-field text-lg py-4"
            required
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            className="input-field text-lg py-4"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCurrentStep(STEPS.OTP)}
            className="btn-secondary flex items-center space-x-2 py-4 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !userDetails.name || !userDetails.email}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 py-4 text-lg"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <User className="w-6 h-6" />
            )}
            <span className="font-semibold">{isLoading ? 'Creating Account...' : 'Complete Setup'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="glass-effect rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-2">
                {Object.values(STEPS).map((step, index) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      Object.values(STEPS).indexOf(currentStep) >= index
                        ? 'bg-primary-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === STEPS.PHONE && renderPhoneStep()}
              {currentStep === STEPS.OTP && renderOtpStep()}
              {currentStep === STEPS.DETAILS && renderDetailsStep()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PhoneLoginModal