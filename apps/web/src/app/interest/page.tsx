'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'

export default function InterestPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSelectRole = async (role: 'Customer' | 'Event Organizer') => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}interest`,
        { userType: role },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = res.data

      if (data.status === 'success') {
        router.push('/')
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-4xl mx-auto pt-16 pb-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E0A3C] mb-4">
            Welcome to Eventasy! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xl text-gray-600">
            We're glad you're here! What can we help you with first?
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Find Experience Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-8">
              <div className="w-32 h-32 mx-auto mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2641/2641497.png"
                  alt="Find experiences"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-center text-[#1E0A3C] mb-4">
                Find an experience
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Discover amazing events and activities near you
              </p>
              <Button 
                onClick={() => handleSelectRole('Customer')}
                className="w-full bg-[#D1410C] hover:bg-[#F05537] text-white"
              >
                Tell us what you love
              </Button>
            </div>
          </div>

          {/* Organize Event Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-8">
              <div className="w-32 h-32 mx-auto mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1535/1535012.png"
                  alt="Organize events"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-center text-[#1E0A3C] mb-4">
                Organize an event
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Create and manage your own successful events
              </p>
              <Button 
                onClick={() => handleSelectRole('Event Organizer')}
                className="w-full bg-[#D1410C] hover:bg-[#F05537] text-white"
              >
                Plan your best event ever
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}