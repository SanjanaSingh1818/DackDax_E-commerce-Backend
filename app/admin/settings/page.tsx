"use client"

import { useState,useEffect } from "react"

export default function SettingsPage(){

  const [margin,setMargin] = useState("")

  useEffect(()=>{

    const stored = localStorage.getItem("margin")

    if(stored){

      setMargin(stored)

    }

  },[])

  const saveMargin = ()=>{

    localStorage.setItem("margin",margin)

    alert("Margin saved")

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Margin Settings
      </h1>

      <input
        value={margin}
        onChange={(e)=>setMargin(e.target.value)}
        placeholder="Margin %"
        className="border p-2 mr-3"
      />

      <button onClick={saveMargin}>
        Save
      </button>

    </div>

  )

}
