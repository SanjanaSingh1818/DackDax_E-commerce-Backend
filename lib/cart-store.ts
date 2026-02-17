"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { cartAPI } from "@/lib/api"

export interface CartItem {

  id:string
  title:string
  price:number
  image:string
  quantity:number

}

interface CartStore {

  items:CartItem[]

  setCart:(items:CartItem[])=>void

  addItem:(product:Omit<CartItem,"quantity">)=>Promise<void>

  increaseQty:(id:string)=>Promise<void>

  decreaseQty:(id:string)=>Promise<void>

  removeItem:(id:string)=>Promise<void>

  clearCart:()=>Promise<void>

  getCount:()=>number

  getTotal:()=>number

  normalizeId:(value:any)=>string

}

export const useCartStore = create<CartStore>()(

persist(

(set,get)=>({

items:[],

normalizeId:(value:any)=>{
  if(value===undefined||value===null) return ""
  if(typeof value==="object"){
    if(value.$oid) return String(value.$oid).trim()
    if(value._id) return String(value._id).trim()
    if(value.id) return String(value.id).trim()
  }
  const str=String(value).trim()
  if(!str||str==="undefined"||str==="null") return ""
  if(str==="[object Object]") return ""
  return str
},


setCart:(items)=>set({items}),


addItem:async(product)=>{

const token = localStorage.getItem("token")
const id = (get() as any).normalizeId(product.id)
if(!id){
  console.error("Add to cart blocked: missing product.id", product)
  return
}

const items=get().items

const existing=items.find(i=>i.id===id)

if(existing){

set({

items:items.map(i=>
i.id===id
?{...i,quantity:i.quantity+1}
:i
)

})

if(token){

await cartAPI.update(
id,
existing.quantity+1,
token
)

}

}

else{

set({

items:[
...items,
{...product,id,quantity:4}
]

})

if(token){

await cartAPI.add({

productId:id,
quantity:4

},token)

}

}

},


increaseQty:async(id)=>{

const token=localStorage.getItem("token")
const safeId = (get() as any).normalizeId(id)
if(!safeId) return

const item=get().items.find(i=>i.id===safeId)

if(!item)return

set({

items:get().items.map(i=>
i.id===safeId
?{...i,quantity:i.quantity+1}
:i
)

})

if(token){

await cartAPI.update(
safeId,
item.quantity+1,
token
)

}

},


decreaseQty:async(id)=>{

const token=localStorage.getItem("token")
const safeId = (get() as any).normalizeId(id)
if(!safeId) return

const item=get().items.find(i=>i.id===safeId)

if(!item)return

if(item.quantity===1){

get().removeItem(safeId)

return

}

set({

items:get().items.map(i=>
i.id===safeId
?{...i,quantity:i.quantity-1}
:i
)

})

if(token){

await cartAPI.update(
safeId,
item.quantity-1,
token
)

}

},


removeItem:async(id)=>{

const token=localStorage.getItem("token")
const safeId = (get() as any).normalizeId(id)
if(!safeId) return

set({

items:get().items.filter(i=>i.id!==safeId)

})

if(token){

await cartAPI.remove(safeId,token)

}

},


clearCart:async()=>{

const token=localStorage.getItem("token")

const items=get().items

set({items:[]})

if(token){

for(const item of items){

const safeId = (get() as any).normalizeId(item.id)
if(!safeId) continue
await cartAPI.remove(safeId,token)

}

}

},


getCount:()=>get().items.reduce((t,i)=>t+i.quantity,0),

getTotal:()=>get().items.reduce((t,i)=>t+i.price*i.quantity,0)

}),

{

name:"dackdax-cart",

storage:createJSONStorage(()=>localStorage)

}

)

)

