"use client"

import { useEffect, useState } from "react"

import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts"

import { productAPI } from "@/lib/api"



export default function AdminDashboard(){

  const [loading,setLoading] = useState(true)

  const [stats,setStats] = useState({

    products: 0,
    orders: 0,
    revenue: 0

  })

  const [dailyData,setDailyData] = useState<any[]>([])
  const [monthlyData,setMonthlyData] = useState<any[]>([])



  useEffect(()=>{

    loadStats()

  },[])



  async function loadStats(){

    try{

      const token = localStorage.getItem("token")



      /* PRODUCTS */

      const productRes = await productAPI.getAll({

        page: 1,
        limit: 1

      })

      const productCount = productRes.total || 0



      /* ORDERS */

      let ordersCount = 0
      let revenue = 0

      let daily:any = {}
      let monthly:any = {}



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

          const orderData = await res.json()

          ordersCount = orderData.length || 0



          orderData.forEach((order:any)=>{

            const amount = Number(order.total) || 0

            revenue += amount



            /* Fix date parsing */

            const dateObj = order.createdAt
              ? new Date(order.createdAt)
              : new Date()



            const day =
              dateObj.toLocaleDateString("sv-SE")

            const month =
              dateObj.toLocaleDateString("sv-SE",{
                year:"numeric",
                month:"short"
              })



            /* Daily */

            if(!daily[day]) daily[day] = 0
            daily[day] += amount



            /* Monthly */

            if(!monthly[month]) monthly[month] = 0
            monthly[month] += amount

          })



          /* Convert to arrays */

          const dailyArray =
            Object.keys(daily).map(date=>({

              date,
              revenue: daily[date]

            }))

          const monthlyArray =
            Object.keys(monthly).map(month=>({

              month,
              revenue: monthly[month]

            }))



          setDailyData(dailyArray)
          setMonthlyData(monthlyArray)

        }

      }catch(err){

        console.error(err)

      }



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

    return <div>Loading dashboard...</div>

  }



  return(

    <div className="space-y-8">


      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Store analytics overview
        </p>

      </div>



      {/* Stats */}

      <div className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
      ">

        <StatCard
          title="Products"
          value={stats.products}
          icon={Package}
          color="bg-blue-500"
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={ShoppingCart}
          color="bg-purple-500"
        />

        <StatCard
          title="Revenue"
          value={`${stats.revenue} kr`}
          icon={DollarSign}
          color="bg-green-500"
        />

      </div>



      {/* Daily Chart */}

      <ChartCard
        title="Daily Revenue"
        icon={TrendingUp}
      >

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={dailyData}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="date"/>

            <YAxis/>

            <Tooltip/>

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </ChartCard>



      {/* Monthly Chart */}

      <ChartCard
        title="Monthly Revenue"
        icon={Calendar}
      >

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={monthlyData}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="month"/>

            <YAxis/>

            <Tooltip/>

            <Bar
              dataKey="revenue"
              fill="#D4AF37"
              radius={[4,4,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </ChartCard>



    </div>

  )

}



/* Stat Card */

function StatCard({title,value,icon:Icon,color}:any){

  return(

    <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">

      <div>

        <div className="text-gray-500 text-sm">
          {title}
        </div>

        <div className="text-2xl font-bold">
          {value}
        </div>

      </div>

      <div className={`${color} text-white p-3 rounded-lg`}>
        <Icon size={20}/>
      </div>

    </div>

  )

}



/* Chart Card */

function ChartCard({title,icon:Icon,children}:any){

  return(

    <div className="bg-white p-6 rounded-xl shadow border">

      <div className="flex items-center gap-2 mb-4">

        <Icon className="text-[#D4AF37]"/>

        <h2 className="font-semibold">
          {title}
        </h2>

      </div>

      {children}

    </div>

  )

}
