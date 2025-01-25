"use client"

import axios from "axios"
import Cookies from "js-cookie";

const base_url = "http://localhost:1234"

interface IEventsDto {
  title:string,
  description:string,
  image:string,
  location:string,
  date:string,
  event_type:string,
  price:number,
  max_voucher_disc:number,
  category:string
}

export async function eventListProcess(data: { content: string; }) {
  
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

export async function eventCreateProcess(data:IEventsDto) {
    try {
        let newToken = ""
        if(Cookies.get("token")){
            newToken = "Bearer "+Cookies.get("token")
        }

        return await axios.post(base_url+"/event",data,{
            headers:{
                Authorization:newToken
            }
        })
    } catch (err:any) {
        
    }
}