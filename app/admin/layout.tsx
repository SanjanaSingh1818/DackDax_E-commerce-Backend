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

  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [isMobile,setIsMobile] = useState(false)
  const [checkingAuth,setCheckingAuth] = useState(true)



  /* =========================
     Protect Admin Routes
  ========================== */

  useEffect(()=>{

    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if(!token || !userString){

      router.replace("/login")
      return

    }

    try{

      const user = JSON.parse(userString)

      if(user.role !== "admin"){

        router.replace("/")
        return

      }

      setCheckingAuth(false)

    }catch{

      router.replace("/login")

    }

  },[router])



  /* =========================
     Mobile Detection
  ========================== */

  useEffect(()=>{

    const handleResize = ()=>{

      const mobile = window.innerWidth < 768

      setIsMobile(mobile)

      if(!mobile){

        setSidebarOpen(true)

      }else{

        setSidebarOpen(false)

      }

    }

    handleResize()

    window.addEventListener("resize",handleResize)

    return ()=>window.removeEventListener("resize",handleResize)

  },[])



  /* =========================
     Logout
  ========================== */

  function logout(){

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    router.replace("/login")

  }



  /* =========================
     Sidebar Links
  ========================== */

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



  /* =========================
     Loading State
  ========================== */

  if(checkingAuth){

    return(

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-lg font-semibold">
          Loading Admin Panel...
        </div>

      </div>

    )

  }



  /* =========================
     Layout
  ========================== */

  return(

    <div className="flex min-h-screen bg-gray-100">


      {/* Overlay (mobile only) */}

      {sidebarOpen && isMobile && (

        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={()=>setSidebarOpen(false)}
        />

      )}



      {/* Sidebar */}

      <aside className={`

        fixed md:relative z-40
        h-full md:h-auto
        w-64
        bg-black text-white
        shadow-xl

        transform transition-transform duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

        md:translate-x-0

      `}>


        {/* Sidebar Header */}

        <div className="flex items-center justify-between p-5 border-b border-gray-800">

          <h2 className="text-lg font-bold">
            DackDax Admin
          </h2>


          {/* Close button mobile */}

          <button
            onClick={()=>setSidebarOpen(false)}
            className="md:hidden"
          >
            <X size={20}/>
          </button>

        </div>



        {/* Sidebar Links */}

        <nav className="p-4 space-y-2">

          {links.map(link=>(

            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname===link.href}
              onClick={()=>isMobile && setSidebarOpen(false)}
            />

          ))}

        </nav>

      </aside>



      {/* Main Area */}

      <div className="flex-1 flex flex-col min-w-0">


        {/* Header */}

        <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">


          {/* Left */}

          <div className="flex items-center gap-3">

            <button
              onClick={()=>setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu size={22}/>
            </button>

            <h1 className="font-semibold text-lg">
              Admin Panel
            </h1>

          </div>


          {/* Right */}

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18}/>

            <span className="hidden sm:inline">
              Logout
            </span>

          </button>

        </header>



        {/* Content Container */}

        <main className="flex-1">

          <div className="
            mx-auto
            w-full
            max-w-[1400px]
            px-4
            sm:px-6
            lg:px-8
            py-6
            lg:py-8
          ">

            {children}

          </div>

        </main>


      </div>


    </div>

  )

}



/* =========================
   Sidebar Link Component
========================= */

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  onClick
}:any){

  return(

    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition

        ${active
          ? "bg-[#D4AF37] text-black font-medium"
          : "hover:bg-gray-800 text-gray-300 hover:text-white"
        }
      `}
    >

      <Icon size={18}/>

      {label}

    </Link>

  )

}
