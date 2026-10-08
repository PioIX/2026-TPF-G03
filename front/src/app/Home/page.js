"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [estadistica,setEstadistica]=useState({})
  // id de usuario de prueba, se debe obtener con algún storage
  const usuarioId = 1
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    useFetch.getUsuarioPorId(usuarioId)
    .then((data)=>{
      setUsuario(data.message)
    })
  },[])

  useEffect(()=>{
    if(usuario && Object.keys(usuario).length!=0){
      setLoading(false)
    }
  },[usuario])

  
  useEffect(()=>{

  },[])

  function cargarEst(){
    setEstadistica(()=>{
      useFetch.getEstadisticaDeUsuario(usuarioId)
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