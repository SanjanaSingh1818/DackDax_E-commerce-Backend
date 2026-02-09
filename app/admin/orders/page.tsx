"use client"

import { useEffect, useState } from "react"
import { orderAPI } from "@/lib/api"

export default function OrdersPage() {

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    async function loadOrders() {

      try {

        const token = localStorage.getItem("token")

        if (!token) {
          setError("Please login first")
          setLoading(false)
          return
        }

        const res = await orderAPI.getAll(token)

        setOrders(Array.isArray(res) ? res : res.orders || [])

      } catch (err: any) {

        setError(err.message || "Failed to load orders")

      } finally {

        setLoading(false)

      }

    }

    loadOrders()

  }, [])

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Orders
      </h1>

      {loading && (
        <div className="text-gray-500">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-gray-500">
          No orders found.
        </div>
      )}

      {orders.map(order => (

        <div
          key={order._id || order.id}
          className="bg-white p-4 rounded-xl shadow mb-4"
        >

          <div className="font-semibold">
            Order #{order._id || order.id}
          </div>

          <div className="text-gray-500">
            Total: {order.totalAmount ?? order.total} kr
          </div>

          <div className="text-sm">
            Status: {order.status || "pending"}
          </div>

        </div>

      ))}

    </div>

  )

}
