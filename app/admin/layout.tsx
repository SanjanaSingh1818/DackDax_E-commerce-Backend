"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Upload,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react"

export default function AdminLayout({
  children
}:{
  children: React.ReactNode
}){

  const pathname = usePathname()
  const router = useRouter()

  const [sidebarOpen,setSidebarOpen] = useState(true)

  const [isMobile,setIsMobile] = useState(false)

  // Protect admin routes
  useEffect(()=>{

    const role = localStorage.getItem("role")

    if(role !== "admin"){

      router.push("/login")

    }

  },[])

  // Detect mobile
  useEffect(()=>{

    const handleResize = ()=>{

      setIsMobile(window.innerWidth < 768)

      if(window.innerWidth < 768){

        setSidebarOpen(false)

      }else{

        setSidebarOpen(true)

      }

    }

    handleResize()

    window.addEventListener("resize",handleResize)

    return ()=>window.removeEventListener("resize",handleResize)

  },[])

  function logout(){

    localStorage.removeItem("role")

    router.push("/login")

  }

  const links = [

    {
      href:"/admin",
      label:"Dashboard",
      icon:LayoutDashboard
    },

    {
      href:"/admin/products",
      label:"Products",
      icon:Package
    },

    {
      href:"/admin/orders",
      label:"Orders",
      icon:ShoppingCart
    },

    {
      href:"/admin/upload",
      label:"CSV Upload",
      icon:Upload
    },

    {
      href:"/admin/settings",
      label:"Settings",
      icon:Settings
    }

  ]

  return(

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <div className={`
        fixed md:relative z-40
        ${sidebarOpen ? "w-64" : "w-0"}
        bg-black text-white
        transition-all duration-300
        overflow-hidden
      `}>

        <div className="p-6">

          <h2 className="text-xl font-bold mb-8">
            DackDax Admin
          </h2>

          <nav className="space-y-2">

            {links.map(link=>(

              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname===link.href}
              />

            ))}

          </nav>

        </div>

      </div>

      {/* Main */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

          <button
            onClick={()=>setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            {sidebarOpen
              ? <X/>
              : <Menu/>
            }
          </button>

          <div className="font-semibold">
            Admin Panel
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18}/>
            Logout
          </button>

        </header>

        {/* Content */}

        <main className="p-6">

          {children}

        </main>

      </div>

    </div>

  )

}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active
}:any){

  return(

    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${active
          ? "bg-[#D4AF37] text-black"
          : "hover:bg-gray-800"
        }
      `}
    >

      <Icon size={18}/>

      {label}

    </Link>

  )

}
