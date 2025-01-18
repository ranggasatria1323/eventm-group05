'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Facebook, Linkedin } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}register`, { // Pastikan endpoint benar
        name,
        email,
        password,
      })

      const data = res.data

      if (data.status === 'success') {
        // Simpan token ke localStorage atau context
        localStorage.setItem('token', data.data.token)
        // Redirect ke halaman interest untuk memilih role
        router.push('/interest')
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('There was an error!', error)
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full px-12 bg-white">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Input 
        type="text" 
        placeholder="Name" 
        className="mb-4" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Input 
        type="email" 
        placeholder="Email" 
        className="mb-4" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input 
        type="password" 
        placeholder="Password" 
        className="mb-4" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button type="submit" className="w-full mb-4 bg-[#4bb6b7] hover:bg-[#45a3a4]">Register</Button>
      <span className="text-sm mb-4">or use your account</span>
      <div className="flex space-x-4">
        <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
          <Facebook size={20} />
        </a>
        <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
          <Linkedin size={20} />
        </a>
      </div>
    </form>
  )
}
