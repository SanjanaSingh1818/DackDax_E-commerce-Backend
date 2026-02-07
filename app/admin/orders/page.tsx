"use client"

import { useEffect,useState } from "react"

export default function OrdersPage(){

  const [orders,setOrders] = useState<any[]>([])

  useEffect(()=>{

    const stored = localStorage.getItem("orders")

    if(stored){

      setOrders(JSON.parse(stored))

    }

  },[])

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Orders
      </h1>

      {orders.map(order=>(

        <div
          key={order.id}
          className="bg-white p-4 rounded-xl shadow mb-4"
        >

          <div className="font-semibold">

            Order #{order.id}

          </div>

          <div className="text-gray-500">

            Total: {order.total} kr

          </div>

          <div className="text-sm">

            Status: {order.status}

          </div>

        </div>

      ))}

    </div>

  )

}
