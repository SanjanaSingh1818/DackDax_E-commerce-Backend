"use client"

import { useState } from "react"

export default function UploadPage(){

  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState<string | null>(null)

  const handleUpload = async (e:any)=>{

    const file = e.target.files?.[0]
    if(!file) return

    setLoading(true)
    setMessage(null)

    try{

      const token = localStorage.getItem("token")
      if(!token){
        setMessage("Please login as admin first.")
        return
      }

      const form = new FormData()
      form.append("file", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/upload`,
        {
          method:"POST",
          headers:{
            Authorization:`Bearer ${token}`
          },
          body: form
        }
      )

      if(!res.ok){
        const err = await res.text()
        throw new Error(err || "Upload failed")
      }

      const data = await res.json()
      setMessage(`Upload complete. Inserted: ${data.inserted ?? 0}`)

    }catch(err:any){
      setMessage(err.message || "Upload failed")
    }finally{
      setLoading(false)
    }

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        CSV Upload
      </h1>

      <input type="file" accept=".csv" onChange={handleUpload}/>

      {loading && (
        <div className="text-gray-500 mt-3">
          Uploading...
        </div>
      )}

      {message && (
        <div className="mt-3">
          {message}
        </div>
      )}

    </div>

  )

}
