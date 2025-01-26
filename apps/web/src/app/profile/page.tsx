'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfileData, updateProfileData } from './../../api/profile';

interface UserProfile {
  name: string;
  email: string;
  userType: string;
  phoneNumber: string | null;
  birthdate: string | null;
  gender: string | null;
  image: string | File | null;
  referralCode: string;
  points: number;
  remainingDays?: number;
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    userType: '',
    phoneNumber: '',
    birthdate: '',
    gender: '',
    image: null,
    referralCode: '',
    points: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileData();
        if (data.status === 'success') {
          setProfile({
            ...data.data,
            birthdate: data.data.birthdate
              ? new Date(data.data.birthdate).toISOString().split('T')[0]
              : null,
            remainingDays: data.data.remainingDays || 0,
          });
        }
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Ukuran file harus kurang dari 1MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      setProfile((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('phoneNumber', profile.phoneNumber || '');
      formData.append(
        'birthdate',
        profile.birthdate ? new Date(profile.birthdate).toISOString() : '',
      );
      formData.append('gender', profile.gender || '');
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await updateProfileData(formData);
      if (response.status === 'success') {
        toast.success('Data berhasil disimpan!');
        const updatedData = await getProfileData();
        if (updatedData.status === 'success') {
          setProfile(updatedData.data);
        }
      } else {
        toast.error('Gagal menyimpan data.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Informasi Dasar
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={
                    profile.image
                      ? `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${profile.image}`
                      : '/placeholder.svg'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer group-hover:bg-blue-700 transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="name"
              >
                Nama
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipe Pengguna */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="userType"
              >
                Tipe Pengguna
              </label>
              <input
                type="text"
                id="userType"
                name="userType"
                value={profile.userType}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="phoneNumber"
              >
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="birthdate"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={profile.birthdate || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="gender"
              >
                Jenis Kelamin
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Points Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Referral Code
              </h2>
              <p className="text-sm text-gray-700">
                Gunakan kode ini untuk mengundang teman:
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-900">
                {profile.referralCode || "Tidak ada referral code"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.referralCode);
                    toast.success('Kode referral berhasil disalin!');
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                Points
              </h2>
              <p className="text-sm text-gray-700">
                Anda memiliki jumlah poin berikut:
              </p>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-green-900">
                  {profile.points.toLocaleString()}
                </span>
                <span className="ml-2 text-sm text-gray-500">poin</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Sisa waktu sebelum poin kadaluarsa:{' '}
                <span className="font-semibold text-green-800">
                  {profile.remainingDays} hari
                </span>
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProfilePage;
