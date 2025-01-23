"use client"

import Cookies from "js-cookie"
import axios from "axios"

const base_url = "http://localhost:5678"


export function getUserDetail(){
    try {
        if(!Cookies.get("user")){
            throw new Error("you are not login")
        }
    
        const userCookie = String(Cookies.get("user")) 
        const userSession = JSON.parse(userCookie)

        let newToken = ""
        if(Cookies.get("token")){
            newToken = "Bearer "+Cookies.get("token")
        }

        return axios.get(base_url+`/api/users/${userSession?.id}`,{
            headers:{
                Authorization:newToken
            }
        })

    } catch(err) {
        console.log("err : ",err)
    }
   
}

export async function updateUserProfile(data:FormData){

    try {   
        if(!Cookies.get("user")){
            throw new Error("you are not login")
        }
    
        const userCookie = String(Cookies.get("user")) 
        const userSession = JSON.parse(userCookie)
        let newToken = ""
        if(Cookies.get("token")){
            newToken = "Bearer "+Cookies.get("token")
        }
    
        return await axios.put(base_url+`/api/users/${userSession?.id}`,data,{
            headers:{
                Authorization:newToken
            }
        })
    } catch(err){
        console.log("err : ",err)
    }
    
}