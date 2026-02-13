"use client"

import { useState,useEffect } from "react"

import {
  Settings,
  Percent,
  CheckCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"



export default function SettingsPage(){

  const [margin,setMargin] = useState("")

  const [saved,setSaved] = useState(false)

  const [loading,setLoading] = useState(false)



  /* =====================
     Load saved margin
  ===================== */

  useEffect(()=>{

    const stored = localStorage.getItem("margin")

    if(stored){

      setMargin(stored)

    }

  },[])



  /* =====================
     Save margin
  ===================== */

  function saveMargin(){

    if(!margin){

      alert("Please enter margin")

      return

    }

    setLoading(true)

    setTimeout(()=>{

      localStorage.setItem("margin",margin)

      setSaved(true)

      setLoading(false)

      setTimeout(()=>setSaved(false),2000)

    },500)

  }



  /* =====================
     UI
  ===================== */

  return(

    <div className="max-w-xl space-y-6">


      {/* Page Header */}

      <div className="flex items-center gap-3">

        <Settings className="text-[#D4AF37]" />

        <h1 className="text-2xl font-bold">
          Margin Settings
        </h1>

      </div>



      {/* Card */}

      <div className="
        bg-white
        rounded-xl
        shadow-sm
        border
        p-6
        space-y-4
      ">


        {/* Label */}

        <div>

          <label className="text-sm font-medium text-gray-600">

            Default Product Margin (%)

          </label>

          <p className="text-xs text-gray-500 mt-1">

            This margin will be applied to product pricing.

          </p>

        </div>



        {/* Input */}

        <div className="relative">

          <Percent
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="number"
            value={margin}
            onChange={(e)=>setMargin(e.target.value)}
            placeholder="Enter margin percentage"
            className="
              w-full
              border
              rounded-lg
              pl-10
              pr-4
              py-2.5
              focus:outline-none
              focus:ring-2
              focus:ring-[#D4AF37]
              focus:border-transparent
            "
          />

        </div>



        {/* Save Button */}

        <Button

          onClick={saveMargin}

          disabled={loading}

          className="
            bg-[#D4AF37]
            text-black
            hover:bg-[#B8962E]
          "

        >

          {loading ? "Saving..." : "Save Settings"}

        </Button>



        {/* Success Message */}

        {saved && (

          <div className="
            flex items-center gap-2
            text-green-600 text-sm
          ">

            <CheckCircle size={18} />

            Margin saved successfully

          </div>

        )}


      </div>


    </div>

  )

}
