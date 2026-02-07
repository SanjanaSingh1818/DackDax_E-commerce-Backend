"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const STORAGE_KEY = "products"

const ITEMS_PER_PAGE = 8

const CATEGORIES = [
  "Summer",
  "Winter",
  "All-Season"
]

export default function AdminProductsPage(){

  const [products,setProducts] = useState<any[]>([])

  const [filtered,setFiltered] = useState<any[]>([])

  const [search,setSearch] = useState("")

  const [page,setPage] = useState(1)

  const [form,setForm] = useState({
    title:"",
    brand:"",
    price:"",
    image:"",
    category:"Summer",
    stock:0
  })

  const [editingId,setEditingId] = useState<number|null>(null)

  useEffect(()=>{

    loadProducts()

  },[])

  useEffect(()=>{

    handleSearch(search)

  },[products])

  function loadProducts(){

    const stored = localStorage.getItem(STORAGE_KEY)

    if(stored){

      const data = JSON.parse(stored)

      setProducts(data)

      setFiltered(data)

    }

  }

  function saveProducts(data:any){

    localStorage.setItem(STORAGE_KEY,JSON.stringify(data))

    setProducts(data)

  }

  function handleImageUpload(e:any){

    const reader = new FileReader()

    reader.onload = ()=>{

      setForm({
        ...form,
        image: reader.result as string
      })

    }

    reader.readAsDataURL(e.target.files[0])

  }

  function handleSearch(value:string){

    setSearch(value)

    const filtered = products.filter(p=>
      p.title?.toLowerCase().includes(value.toLowerCase())
      ||
      p.brand?.toLowerCase().includes(value.toLowerCase())
    )

    setFiltered(filtered)

    setPage(1)

  }

  function addOrUpdate(){

    if(editingId){

      const updated = products.map(p=>
        p.id===editingId
        ? {...form,id:editingId}
        : p
      )

      saveProducts(updated)

      setEditingId(null)

    }else{

      const newProduct = {

        id: Date.now(),

        ...form,

        stock: Number(form.stock),

        price: Number(form.price),

        status:
          form.stock == 0
          ? "Out of Stock"
          : form.stock < 5
          ? "Low Stock"
          : "In Stock"

      }

      saveProducts([...products,newProduct])

    }

    resetForm()

  }

  function resetForm(){

    setForm({
      title:"",
      brand:"",
      price:"",
      image:"",
      category:"Summer",
      stock:0
    })

  }

  function edit(product:any){

    setEditingId(product.id)

    setForm(product)

  }

  function deleteProduct(id:number){

    if(!confirm("Delete this product?")) return

    saveProducts(products.filter(p=>p.id!==id))

  }

  const start = (page-1)*ITEMS_PER_PAGE

  const paginated = filtered.slice(
    start,
    start+ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(
    filtered.length/ITEMS_PER_PAGE
  )

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Enterprise Product Management
      </h1>

      {/* Search */}

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e)=>handleSearch(e.target.value)}
        className="mb-4"
      />

      {/* Form */}

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-2 gap-3">

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e)=>setForm({...form,title:e.target.value})}
        />

        <Input
          placeholder="Brand"
          value={form.brand}
          onChange={(e)=>setForm({...form,brand:e.target.value})}
        />

        <Input
          placeholder="Price"
          value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})}
        />

        <Input
          placeholder="Stock"
          value={form.stock}
          onChange={(e)=>setForm({...form,stock:Number(e.target.value)})}
        />

        <select
          value={form.category}
          onChange={(e)=>setForm({...form,category:e.target.value})}
          className="border p-2 rounded"
        >
          {CATEGORIES.map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="file"
          onChange={handleImageUpload}
        />

        <Button onClick={addOrUpdate}>
          {editingId ? "Update" : "Add"}
        </Button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow">

        {paginated.map(product=>(

          <div
            key={product.id}
            className="flex items-center justify-between border-b p-3"
          >

            <div className="flex gap-4 items-center">

              {product.image && (

                <img
                  src={product.image}
                  className="w-12 h-12"
                />

              )}

              <div>

                <div className="font-semibold">
                  {product.brand} {product.title}
                </div>

                <div className="text-sm text-gray-500">

                  {product.category}

                </div>

              </div>

            </div>

            <div>

              Stock: {product.stock}

            </div>

            <div>

              {product.status}

            </div>

            <div>

              {product.price} kr

            </div>

            <div className="flex gap-2">

              <Button onClick={()=>edit(product)}>
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={()=>deleteProduct(product.id)}
              >
                Delete
              </Button>

            </div>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="flex gap-2 mt-4">

        {Array.from({length:totalPages},(_,i)=>(

          <Button
            key={i}
            onClick={()=>setPage(i+1)}
            variant={page===i+1?"default":"outline"}
          >
            {i+1}
          </Button>

        ))}

      </div>

    </div>

  )

}
