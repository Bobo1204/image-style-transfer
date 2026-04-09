'use client'

import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'

interface GoogleUser {
  id: string
  email: string
  name: string
  image: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement | null, options: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

// 硬编码 Google Client ID
const GOOGLE_CLIENT_ID = '691367567402-ittqpqispd6carvm5ffjof29n68atvpa.apps.googleusercontent.com'

export function UserAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!GOOGLE_CLIENT_ID) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: 200,
            text: 'signin_with',
            shape: 'pill'
          }
        )
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [loading])

  const handleCredentialResponse = (response: any) => {
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    const userData: GoogleUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.picture,
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {user.name?.[0] || 'U'}
          </div>
        )}
        <span className="text-sm text-gray-700 hidden sm:block max-w-[100px] truncate">{user.name}</span>
        <button
          onClick={handleSignOut}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return <div id="google-signin-button"></div>
}
