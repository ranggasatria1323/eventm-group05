"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Cookies from "js-cookie"

interface UserProfile {
  name: string
  email: string
  userType: string
  phone: string | null
  birthDate: string | null
  gender: string | null
  profileImage: string | File | null
}

function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    userType: "",
    phone: "",
    birthDate: "",
    gender: "",
    profileImage: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getProfileData()
  }, [])

  const getProfileData = async () => {
    try {
      const token = Cookies.get("token")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.status === "success") {
        const data = response.data.data
        setProfile(data)
        if (data.profileImage) {
          setProfileImage(data.profileImage)
        }
      }
    } catch (error) {
      toast.error("Gagal mengambil data profil")
      console.error("Error fetching profile data:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Ukuran file harus kurang dari 1MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setProfile((prev) => ({
        ...prev,
        profileImage: file,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    if (profile.phone) formData.append("phone", profile.phone)
    if (profile.birthDate) formData.append("birthDate", profile.birthDate)
    if (profile.gender) formData.append("gender", profile.gender)

    if (profile.profileImage instanceof File) {
      formData.append("profileImage", profile.profileImage)
    }

    try {
      const token = Cookies.get("token")
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.status === "success") {
        toast.success("Profil berhasil diperbarui!")
        getProfileData()
      }
    } catch (error) {
      toast.error("Gagal memperbarui profil")
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "Customer":
        return "Pelanggan"
      case "Event Organizer":
        return "Penyelenggara Event"
      default:
        return userType
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Informasi Dasar</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer group-hover:bg-blue-700 transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Ukuran maksimum file: 1MB. Format: JPG, PNG</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={profile.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pengguna</label>
                <input
                  type="text"
                  value={getUserTypeLabel(profile.userType)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="birthDate"
                  value={profile.birthDate || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProfilePage

