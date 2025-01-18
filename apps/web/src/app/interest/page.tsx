'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useState } from 'react'
import Cookies from 'js-cookie' // Import js-cookie
import { Button } from '@/components/ui/button'

export default function InterestPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSelectRole = async (role: 'Customer' | 'Event Organizer') => {
    try {
      const token = Cookies.get('token') // Ambil token dari cookie
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}interest`, 
        { userType: role }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = res.data

      if (data.status === 'success') {
        if (role === 'Customer') {
          router.push('/')
        } else if (role === 'Event Organizer') {
          router.push('/')
        }
      } else {
        setError(data.message || 'Failed to update user role')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Failed to update user role')
      } else {
        console.error('There was an error!', error)
        setError('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {error && <p className="text-red-500 col-span-2 text-center">{error}</p>}
        <div 
          className="p-8 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition" 
          onClick={() => handleSelectRole('Customer')}
        >
          <img src="/path-to-animation-find-experience.gif" alt="Find an experience" className="w-full mb-4" />
          <h2 className="text-2xl font-bold text-center">Find an experience</h2>
          <Button className="w-full mt-4">Choose as Customer</Button>
        </div>
        <div 
          className="p-8 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition" 
          onClick={() => handleSelectRole('Event Organizer')}
        >
          <img src="/path-to-animation-organize-event.gif" alt="Organize an event" className="w-full mb-4" />
          <h2 className="text-2xl font-bold text-center">Organize an event</h2>
          <Button className="w-full mt-4">Choose as Event Organizer</Button>
        </div>
      </div>
    </div>
  )
}
