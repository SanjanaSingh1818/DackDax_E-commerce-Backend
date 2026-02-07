"use client"

export default function UploadPage(){

  const handleUpload = (e:any)=>{

    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = ()=>{

      const csv = reader.result as string

      const rows = csv.split("\n")

      const products = rows.map(row=>{

        const cols = row.split(",")

        return {

          id: Date.now()+Math.random(),

          brand: cols[0],

          title: cols[1],

          price: cols[2]

        }

      })

      localStorage.setItem("products",JSON.stringify(products))

      alert("CSV uploaded")

    }

    reader.readAsText(file)

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        CSV Upload
      </h1>

      <input type="file" accept=".csv" onChange={handleUpload}/>

    </div>

  )

}
