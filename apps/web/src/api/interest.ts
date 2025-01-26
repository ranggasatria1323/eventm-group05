import axios from 'axios';

export const updateUserRole = async (role: 'Customer' | 'Event Organizer', token: string) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}interest`,
      { userType: role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update user role');
    }
    throw new Error('An unexpected error occurred.');
  }
};
