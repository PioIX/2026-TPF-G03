"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function LoginPage() {
 const router=useRouter()


  return (
    <>
    <button onClick={()=>{router.push("./JuegoSP")}}>Ir al juego</button>
    </>
  );
}