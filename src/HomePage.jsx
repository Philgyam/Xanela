'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Mail } from 'lucide-react'; // Import LucideChat icons
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="relative w-full max-w-md">
        {/* Dark glass effect background */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl" />

        {/* Content */}
        <div className="relative p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <form className="space-y-4">
                {isSignUp && (
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300"
                    prefix={<User className="w-5 h-5 text-gray-400" />}
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300"
                  prefix={<Mail className="w-5 h-5 text-gray-400" />}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300"
                  prefix={<Lock className="w-5 h-5 text-gray-400" />}
                />
                {isSignUp && (
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300"
                    prefix={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                )}
                <Button className="w-full bg-white text-purple-700 hover:bg-opacity-90 transition-colors">
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-white hover:underline focus:outline-none mb-2"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
            {/* One Time Visitor Button */}
            <Button 
              onClick={handleOneTimeVisitor} 
              className="w-full bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            >
              One Time Visitor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}