"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function LoginPage() {
 const router=useRouter()
 const [logged,setLogged]=useState(true)
 const [userID,setUserID]=useState(1)


  useEffect(()=>{
    if(logged){
      localStorage.setItem("userid",userID)
      router.push("./Home")
    }
  },[logged])

  return (
    <>
    <p>hola soy el login</p>
    </>
  );
}