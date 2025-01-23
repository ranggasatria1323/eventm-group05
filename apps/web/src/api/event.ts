"use client"

import axios from "axios"


export async function eventListProcess(p0: { content: string; }) {
  const base_url = "http://localhost:1234"
    try {
      const response = await axios.get(base_url + '/events');
      console.log('API response:', response.data);

      if (response?.status === 200) {
        console.log('Events data:', response.data.data);
        return(response.data.data);
      } else {
        console.error('Unexpected status code:', response.data.status);
        return([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return([]);
    }
}
