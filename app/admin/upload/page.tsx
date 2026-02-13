"use client"

import { useState, useRef } from "react"

import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"



export default function UploadPage(){

  const [file,setFile] = useState<File | null>(null)

  const [loading,setLoading] = useState(false)

  const [message,setMessage] = useState<string | null>(null)

  const [error,setError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)



  /* ======================
     File Select
  ====================== */

  function handleSelect(e:any){

    const selected = e.target.files?.[0]

    if(!selected) return

    setFile(selected)
    setMessage(null)
    setError(false)

  }



  /* ======================
     Remove File
  ====================== */

  function removeFile(){

    setFile(null)
    setMessage(null)
    setError(false)

    if(inputRef.current){

      inputRef.current.value = ""

    }

  }



  /* ======================
     Upload File
  ====================== */

  async function handleUpload(){

    if(!file){

      setMessage("Please select a CSV file.")
      setError(true)

      return

    }

    setLoading(true)
    setMessage(null)
    setError(false)

    try{

      const token = localStorage.getItem("token")

      if(!token){

        throw new Error("Please login as admin.")

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

          body:form

        }

      )


      if(!res.ok){

        const err = await res.text()

        throw new Error(err || "Upload failed")

      }


      const data = await res.json()

      setMessage(
        `Upload successful. Inserted ${data.inserted ?? 0} products.`
      )

      setFile(null)

    }
    catch(err:any){

      setMessage(err.message || "Upload failed")
      setError(true)

    }
    finally{

      setLoading(false)

    }

  }



  /* ======================
     Drag & Drop
  ====================== */

  function handleDrop(e:any){

    e.preventDefault()

    const dropped = e.dataTransfer.files?.[0]

    if(dropped){

      setFile(dropped)
      setMessage(null)
      setError(false)

    }

  }



  return(

    <div className="max-w-2xl">

      <h1 className="text-2xl font-bold mb-6">
        CSV Upload
      </h1>


      {/* Card */}

      <div className="bg-white rounded-xl shadow border p-6">


        {/* Drop Area */}

        {!file && (

          <div

            onDrop={handleDrop}

            onDragOver={(e)=>e.preventDefault()}

            onClick={()=>inputRef.current?.click()}

            className="
              border-2 border-dashed
              rounded-lg
              p-8
              text-center
              cursor-pointer
              hover:border-[#D4AF37]
              transition
            "

          >

            <Upload className="mx-auto mb-3 text-gray-400" size={32}/>

            <div className="font-medium">
              Click or drag CSV file here
            </div>

            <div className="text-sm text-gray-500">
              Supported format: .csv
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleSelect}
              className="hidden"
            />

          </div>

        )}



        {/* File Preview */}

        {file && (

          <div className="border rounded-lg p-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FileText className="text-[#D4AF37]"/>

              <div>

                <div className="font-medium">
                  {file.name}
                </div>

                <div className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>

              </div>

            </div>


            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-600"
            >

              <Trash2 size={18}/>

            </button>

          </div>

        )}



        {/* Upload Button */}

        <Button

          onClick={handleUpload}

          disabled={!file || loading}

          className="
            mt-4
            bg-[#D4AF37]
            text-black
            hover:bg-[#B8962E]
            w-full
          "

        >

          {loading ? "Uploading..." : "Upload CSV"}

        </Button>



        {/* Message */}

        {message && (

          <div className={`
            mt-4
            flex items-center gap-2
            text-sm
            ${error ? "text-red-500" : "text-green-600"}
          `}>

            {error
              ? <AlertCircle size={16}/>
              : <CheckCircle size={16}/>
            }

            {message}

          </div>

        )}


      </div>


    </div>

  )

}
