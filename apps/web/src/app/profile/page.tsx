"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

interface UserProfile {
  name: string;
  email: string;
  userType: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  profileImage: string | File | null;
  referralCode: string;
  points: number;
}

function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg");
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    userType: "",
    phone: "",
    birthDate: "",
    gender: "",
    profileImage: null,
    referralCode: "ABCD1234",
    points: 10000,
  });

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        const data = response.data.data;
        setProfile(data);
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      }
    } catch (error) {
      toast.error("Gagal mengambil data profil");
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("phone", profile.phone || "");
      formData.append("birthDate", profile.birthDate || "");
      formData.append("gender", profile.gender || "");
      if (profile.profileImage instanceof File) {
        formData.append("profileImage", profile.profileImage);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Data berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan data.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data.");
      console.error("Error saving profile data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Informasi Dasar</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={profileImage || "/placeholder.svg"}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfileImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div>
            {[
              { label: "Nama", value: profile.name, placeholder: "Masukkan nama", readOnly: true },
              { label: "Email", value: profile.email, placeholder: "Masukkan email", readOnly: true },
              { label: "Tipe Pengguna", value: profile.userType, placeholder: "Tipe pengguna", readOnly: true },
              { label: "Nomor Telepon", value: profile.phone, placeholder: "Masukkan nomor telepon", readOnly: false },
              { label: "Tanggal Lahir", value: profile.birthDate, placeholder: "Masukkan tanggal lahir", readOnly: false },
              { label: "Jenis Kelamin", value: profile.gender, placeholder: "Pilih jenis kelamin", readOnly: false },
            ].map((field, index) => (
              <div key={index} className="mb-6">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={field.label.toLowerCase()}
                >
                  {field.label}
                </label>
                {field.label === "Jenis Kelamin" ? (
                  <div className="flex items-center gap-4">
                    <select
                      id={field.label.toLowerCase()}
                      value={profile.gender || ""}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                      disabled={field.readOnly}
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type={field.label === "Tanggal Lahir" ? "date" : "text"}
                    id={field.label.toLowerCase()}
                    placeholder={field.placeholder}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.readOnly
                        ? null
                        : setProfile({ ...profile, [field.label.toLowerCase()]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    readOnly={field.readOnly} // Set readOnly attribute here
                    disabled={field.readOnly} // Also disable the field if it's read-only
                  />
                )}
                {index < 5 && <hr className="mt-4" />}
              </div>
            ))}
          </div>

          {/* Referral Code and Points Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Referral Code</h2>
              <p className="text-sm text-gray-700">Gunakan kode ini untuk mengundang teman:</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-900">
                  {profile.referralCode}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(profile.referralCode)
                  }
                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Points</h2>
              <p className="text-sm text-gray-700">Anda memiliki jumlah poin berikut:</p>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-green-900">
                  {profile.points}
                </span>
                <span className="ml-2 text-sm text-gray-500">poin</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProfilePage;
