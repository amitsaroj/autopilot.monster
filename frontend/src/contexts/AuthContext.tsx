'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Verify token and get user data
          const response = await authApi.getProfile()
          setUser(response.data)
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await authApi.login({ email, password })
      
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, error: 'Login failed' }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await authApi.register(userData)
      
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, error: 'Registration failed' }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.getProfile()
      setUser(response.data)
    } catch (error) {
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
