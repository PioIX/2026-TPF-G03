"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function RankingPage() {
  const [datos,setDatos]=useState({})

  useEffect(()=>{
      useFetch.getRanking()
      .then((data)=>{
        setDatos(data.message)
      })
    },[])

    useEffect(()=>{
      
    },[datos])
  return (
    <>
    
    </>
  );
}