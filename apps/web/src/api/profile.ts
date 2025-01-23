import axios from "axios"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export const getProfileData = async () => {
  try {
    const token = Cookies.get("token")
    const response = await axios.get(`${API_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching profile data:", error)
    throw error
  }
}

export const updateProfileData = async (formData: FormData) => {
  try {
    const token = Cookies.get("token")
    const response = await axios.put(`${API_URL}profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating profile data:", error)
    throw error
  }
}

