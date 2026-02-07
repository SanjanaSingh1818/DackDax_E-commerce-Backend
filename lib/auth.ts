export function registerUser(user:any){

  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  )

  const exists = users.find(
    (u:any)=>u.email === user.email
  )

  if(exists){

    throw new Error("User already exists")

  }

  const newUser = {

    id: Date.now(),

    name: user.name,

    email: user.email,

    password: user.password,

    role: "user"

  }

  users.push(newUser)

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  )

}

export function loginUser(email:string,password:string){

  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  )

  const user = users.find(
    (u:any)=>
      u.email === email &&
      u.password === password
  )

  if(!user){

    throw new Error("Invalid email or password")

  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  )

  localStorage.setItem(
    "role",
    user.role
  )

  return user

}

export function logout(){

  localStorage.removeItem("currentUser")

  localStorage.removeItem("role")

}

export function getCurrentUser(){

  return JSON.parse(
    localStorage.getItem("currentUser") || "null"
  )

}

export function isAdmin(){

  return localStorage.getItem("role") === "admin"

}
