"use client"

export default function AdminDashboard(){

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <Card title="Products" value="1120"/>
        <Card title="Orders" value="320"/>
        <Card title="Revenue" value="120,000 kr"/>

      </div>

    </div>

  )

}

function Card({title,value}:any){

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
