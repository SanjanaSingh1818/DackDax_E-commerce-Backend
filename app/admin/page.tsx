"use client"

import { useEffect, useState } from "react"

import { productAPI } from "@/lib/api"



export default function AdminDashboard(){

  const [loading,setLoading] = useState(true)

  const [stats,setStats] = useState({

    products: 0,

    orders: 0,

    revenue: 0

  })



  useEffect(()=>{

    loadStats()

  },[])



  async function loadStats(){

    try{

      const token = localStorage.getItem("token")



      /* PRODUCTS COUNT */

      const productRes = await productAPI.getAll({

        page: 1,

        limit: 1

      })



      const productCount =
        productRes.total || 0



      /* ORDERS COUNT (if you have orderAPI) */

      let ordersCount = 0

      let revenue = 0



      try{

        const res = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )

        if(res.ok){

          const orderData =
            await res.json()

          ordersCount =
            orderData.length || 0

          revenue =
            orderData.reduce(
              (sum:any,o:any)=>
                sum+(o.total||0),
              0
            )

        }

      }catch{}

      

      setStats({

        products: productCount,

        orders: ordersCount,

        revenue

      })



    }catch(err){

      console.error(err)

    }finally{

      setLoading(false)

    }

  }



  if(loading){

    return(
      <div className="p-6">
        Loading dashboard...
      </div>
    )

  }



  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">

        Dashboard

      </h1>



      <div className="grid grid-cols-3 gap-6">

        <Card
          title="Products"
          value={stats.products}
        />

        <Card
          title="Orders"
          value={stats.orders}
        />

        <Card
          title="Revenue"
          value={`${stats.revenue} kr`}
        />

      </div>

    </div>

  )

}



/* CARD COMPONENT */

function Card({
  title,
  value
}:any){

  return(

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-gray-500">

        {title}

      </h2>

      <p className="text-2xl font-bold mt-2">

        {value}

      </p>

    </div>

  )

}
