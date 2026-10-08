"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function HomePage() {
 const [estadistica,setEstadistica]=useState({})
 // id de usuario de prueba, se debe obtener con algún storage
 const usuario = 1

  
  useEffect(()=>{


  },[])

  function cargarEst(){
    setEstadistica(()=>{
      useFetch.getEstadisticaDeUsuario(usuario)
      .then((data)=>{
        console.log(data)
        return data.message
      })
    }
    )
  }

  return (
    <>
    
    </>
  );
}