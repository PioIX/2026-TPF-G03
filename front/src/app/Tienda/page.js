"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function TiendaPage() {
    const [items,setItems]=useState({})
    const [inv,setInv]=useState({})
     // id de usuariode prueba, se debe obtener con algún storage
    const usuarioId = 1

    useEffect(()=>{
      cargarItems()
    },[])

    useEffect(()=>{
      //mostrar/cargar items de la tienda
    },[inv])

    function cargarItems(){
      useFetch.getItems(usuarioId)
        .then((data)=>{
          console.log(data)
          setItems(data.message)
        })
        .then(
          useFetch.getInventario(usuarioId)
          .then((data)=>{
            console.log(data)
            setInv(data.message)
          })
          )
      
      
    }
    


  return (
    <>
    <h1>Hola soy la tienda</h1>
    </>
  );
}