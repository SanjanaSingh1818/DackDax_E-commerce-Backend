"use client"

import { useEffect } from "react"

export default function AdminInit(){

  useEffect(()=>{

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    )

    const adminExists = users.find(
      (u:any)=>u.role === "admin"
    )

    if(!adminExists){

      users.push({

        id: 1,
        name: "Admin",
        email: "admin@dackdax.com",
        password: "admin123",
        role: "admin"

      })

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      )

      console.log("Admin user created")

    }

  },[])

  return null

}
