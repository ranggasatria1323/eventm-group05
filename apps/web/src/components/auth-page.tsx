'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { Button } from '@/components/ui/button'

interface AuthPageProps {
  initialView: 'login' | 'register'
}

export function AuthPage({ initialView }: AuthPageProps) {
  const [isLoginActive, setIsLoginActive] = useState(initialView === 'login')
  const router = useRouter()

  useEffect(() => {
    setIsLoginActive(initialView === 'login')
  }, [initialView])

  const handleViewChange = (view: 'login' | 'register') => {
    setIsLoginActive(view === 'login')
    router.push(view === 'login' ? '/login' : '/register')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f5f7] font-['Poppins',sans-serif]">
      <div className="relative overflow-hidden w-[768px] max-w-full min-h-[500px] bg-white rounded-[25px] shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)]">
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${isLoginActive ? 'left-0 w-1/2 z-2' : 'left-1/2 w-1/2 z-5'}`}>
          {isLoginActive ? <LoginForm /> : <RegisterForm />}
        </div>
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${isLoginActive ? '' : '-translate-x-full'}`}>
          <div className={`bg-[url('https://png.pngtree.com/thumb_back/fw800/background/20240610/pngtree-concert-music-festival-and-celebrate-image_15746657.jpg?height=500&width=384')] bg-no-repeat bg-cover bg-center text-white relative h-full w-[200%] transition-transform duration-600 ease-in-out ${isLoginActive ? '-left-full' : 'left-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,94,109,0.4)] to-[rgba(46,94,109,0)] to-40%"></div>
            <div className={`absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out ${isLoginActive ? 'right-0' : '-translate-x-0'}`}>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {isLoginActive ? "Start your\njourney now" : "Hello\nfriends"}
              </h1>
              <p className="text-sm mb-8">
                {isLoginActive
                  ? "If you don't have an account yet, join us and start your journey"
                  : "If you have an account, login here and have fun"}
              </p>
              <Button
                variant="outline"
                className="border-none bg-[#4bb6b7] text-white hover:border-[#4bb6b7]"
                onClick={() => handleViewChange(isLoginActive ? 'register' : 'login')}
              >
                {isLoginActive ? 'Register' : 'Login'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

