"use client"

import { useEffect, useState } from "react"

import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

import { orderAPI } from "@/lib/api"



export default function OrdersPage(){

  const [orders,setOrders] = useState<any[]>([])

  const [loading,setLoading] = useState(true)

  const [error,setError] = useState<string | null>(null)



  useEffect(()=>{

    loadOrders()

  },[])



  async function loadOrders(){

    try{

      const token = localStorage.getItem("token")

      if(!token){

        setError("Please login first")
        setLoading(false)
        return

      }

      const res = await orderAPI.getAll(token)

      const data =
        Array.isArray(res)
          ? res
          : res.orders || []

      setOrders(data)

    }
    catch(err:any){

      setError(err.message || "Failed to load orders")

    }
    finally{

      setLoading(false)

    }

  }



  /* =====================
     Loading Skeleton
  ===================== */

  if(loading){

    return(

      <div className="space-y-6">

        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"/>

        {[1,2,3].map(i=>(

          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow animate-pulse h-20"
          />

        ))}

      </div>

    )

  }



  return(

    <div className="space-y-6">


      {/* Header */}

      <div className="flex items-center gap-3">

        <ShoppingCart className="text-[#D4AF37]" />

        <h1 className="text-2xl font-bold">
          Orders
        </h1>

      </div>



      {/* Error */}

      {error && (

        <div className="text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </div>

      )}



      {/* Empty */}

      {!error && orders.length===0 && (

        <div className="bg-white p-6 rounded-xl shadow text-gray-500">

          No orders found.

        </div>

      )}



      {/* Desktop Table */}

      {orders.length>0 && (

        <div className="bg-white rounded-xl shadow border overflow-hidden">


          <div className="overflow-x-auto">

            <table className="w-full">


              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left p-4">Order ID</th>

                  <th className="text-left p-4">Customer</th>

                  <th className="text-left p-4">Date</th>

                  <th className="text-left p-4">Total</th>

                  <th className="text-left p-4">Status</th>

                </tr>

              </thead>



              <tbody>

                {orders.map(order=>(

                  <tr
                    key={order._id || order.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">

                      #{(order._id || order.id)?.slice(-6)}

                    </td>


                    <td className="p-4 text-gray-600">

                      {order.customerName ||
                       order.user?.name ||
                       "Customer"}

                    </td>


                    <td className="p-4 text-gray-500">

                      {order.createdAt
                        ? new Date(order.createdAt)
                          .toLocaleDateString()
                        : "-"}

                    </td>


                    <td className="p-4 font-semibold text-[#B8962E]">

                      {order.totalAmount ?? order.total} kr

                    </td>


                    <td className="p-4">

                      <StatusBadge status={order.status} />

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}



    </div>

  )

}



/* =====================
   Status Badge
===================== */

function StatusBadge({status}:any){

  const s = (status || "pending").toLowerCase()

  const map:any = {

    pending:{
      color:"bg-yellow-100 text-yellow-700",
      icon:Clock
    },

    completed:{
      color:"bg-green-100 text-green-700",
      icon:CheckCircle
    },

    cancelled:{
      color:"bg-red-100 text-red-700",
      icon:XCircle
    }

  }

  const config = map[s] || map.pending

  const Icon = config.icon



  return(

    <span className={`
      inline-flex items-center gap-1
      px-2 py-1
      rounded
      text-xs font-medium
      ${config.color}
    `}>

      <Icon size={14}/>

      {s}

    </span>

  )

}
