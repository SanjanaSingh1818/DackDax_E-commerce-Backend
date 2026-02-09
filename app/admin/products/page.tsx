"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { productAPI } from "@/lib/api"



export default function AdminProductsPage(){

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : ""



  const [products,setProducts] = useState<any[]>([])

  const [editingId,setEditingId] = useState<string|null>(null)



  const [form,setForm] = useState({

    url:"",

    title:"",

    brand:"",

    model:"",

    season:"",

    dimensions:"",

    width:"",

    profile:"",

    diameter:"",

    size_index:"",

    ean:"",

    availability:"",

    fuel_rating:"",

    wet_rating:"",

    noise_rating:"",

    price:"",

    image:""

  })



  /* ================= LOAD PRODUCTS ================= */

  useEffect(()=>{

    loadProducts()

  },[])



  async function loadProducts(){

    const res = await productAPI.getAll()

    setProducts(res.products)

  }



  /* ================= HANDLE CHANGE ================= */

  function handleChange(
    key:string,
    value:any
  ){

    setForm({
      ...form,
      [key]: value
    })

  }



  /* ================= CREATE / UPDATE ================= */

  async function handleSubmit(){

    try{

      const data = {

        ...form,

        width: Number(form.width),

        profile: Number(form.profile),

        diameter: Number(form.diameter),

        noise_rating: Number(form.noise_rating),

        price: Number(form.price),

        ean: Number(form.ean)

      }



      if(editingId){

        await productAPI.update(
          editingId,
          data,
          token
        )

      }else{

        await productAPI.create(
          data,
          token
        )

      }



      resetForm()

      loadProducts()

    }catch(err:any){

      alert(err.message)

    }

  }



  /* ================= EDIT ================= */

  function handleEdit(product:any){

    setEditingId(product._id)

    setForm({

      url: product.url || "",

      title: product.title || "",

      brand: product.brand || "",

      model: product.model || "",

      season: product.season || "",

      dimensions: product.dimensions || "",

      width: product.width || "",

      profile: product.profile || "",

      diameter: product.diameter || "",

      size_index: product.size_index || "",

      ean: product.ean || "",

      availability: product.availability || "",

      fuel_rating: product.fuel_rating || "",

      wet_rating: product.wet_rating || "",

      noise_rating: product.noise_rating || "",

      price: product.price || "",

      image: product.image || ""

    })

  }



  /* ================= DELETE ================= */

  async function handleDelete(id:string){

    if(!confirm("Delete product?")) return

    await productAPI.delete(id,token)

    loadProducts()

  }



  /* ================= RESET ================= */

  function resetForm(){

    setEditingId(null)

    setForm({

      url:"",

      title:"",

      brand:"",

      model:"",

      season:"",

      dimensions:"",

      width:"",

      profile:"",

      diameter:"",

      size_index:"",

      ean:"",

      availability:"",

      fuel_rating:"",

      wet_rating:"",

      noise_rating:"",

      price:"",

      image:""

    })

  }



  /* ================= UI ================= */

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Product Management
      </h1>



      {/* FORM */}

      <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl shadow mb-6">

        {Object.keys(form).map((key)=>(

          <Input
            key={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e)=>
              handleChange(
                key,
                e.target.value
              )
            }
          />

        ))}



        <Button
          onClick={handleSubmit}
          className="col-span-3"
        >

          {editingId
            ? "Update Product"
            : "Create Product"}

        </Button>

      </div>



      {/* PRODUCTS LIST */}

      <div className="bg-white rounded-xl shadow">

        {products.map(product=>(

          <div
            key={product._id}
            className="flex justify-between items-center border-b p-3"
          >

            <div className="flex gap-3 items-center">

              <img
                src={product.image}
                className="w-12 h-12"
              />

              <div>

                <div className="font-semibold">

                  {product.brand} {product.model}

                </div>

                <div className="text-sm text-gray-500">

                  {product.dimensions}

                </div>

              </div>

            </div>



            <div>
              {product.price} kr
            </div>



            <div className="flex gap-2">

              <Button
                onClick={()=>
                  handleEdit(product)
                }
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={()=>
                  handleDelete(product._id)
                }
              >
                Delete
              </Button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}
