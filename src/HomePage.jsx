'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Mail,Sparkles,ArrowRight } from 'lucide-react'; // Import LucideChat icons
import { useNavigate } from 'react-router-dom'


export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleMode = () => setIsSignUp(!isSignUp)
  const navigate = useNavigate()

  const handleOneTimeVisitor = () => {
    // Logic for one-time visitor action
    console.log("One Time Visitor clicked");
    navigate('/chat')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-4 flex items-center justify-center">
    <div className="w-full max-w-md">
      {/* Main Auth Card */}
      <div className="bg-black/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-black/60 border-b border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-900/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h3 className="text-gray-100 font-medium text-xl">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Start your journey' : 'Continue your journey'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form className="space-y-4">
                {isSignUp && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-gray-900/70 border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 h-14 pl-12"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-gray-900/70 border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 h-14 pl-12"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-gray-900/70 border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 h-14 pl-12"
                  />
                </div>
                {isSignUp && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full bg-gray-900/70 border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 h-14 pl-12"
                    />
                  </div>
                )}
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-14 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-700 p-6 bg-black/60">
          <button
            onClick={toggleMode}
            className="w-full text-gray-300 hover:text-white mb-4 transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
          <Button 
            onClick={handleOneTimeVisitor} 
            className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Continue as Guest
            <User className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
  )
}