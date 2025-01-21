"use client"

import axios from "axios"
import Cookies from "js-cookie"

const base_url = "http://localhost:1234"

export async function eventListProcess() {
    try {
        let newToken = ""
        if(Cookies.get("token")){
            newToken = "Bearer "+Cookies.get("token")
        }

        return await axios.get(base_url+"/events",{
            headers:{
                Authorization:newToken
            }
        })
    } catch(error) {
        alert(JSON.stringify(error))
    }
}
