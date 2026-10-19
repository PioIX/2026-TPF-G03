"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
/*IDEAS PARA PIPIS:
PIPI QUE TE MULTIPLICA LOS PUNTOS (COME PUNTOS)
PIPI RANDOM QUE RESTA O SUMA PUNTOS
PIPI CLICKER
PIPI QUE NO FUNCIONA SI SOS POBRE
PIPI QUE SE COME PUNTOS CADA APUESTA PERO TIENE CHANCE DE SUMAR MUCHOS PUNTOS (vomita)

comprar pipi normal y clickearlo antes de desbloquear otros
alguno tiene agenda política
hay beef entre pipis
*/

export default function TiendaPage() {
    const [items,setItems]=useState([])
    const [usuario,setUsuario]=useState({})
    const [inv,setInv]=useState([])
    const [loading,setLoading]=useState(true)

    let usuarioId = 0
    const router = useRouter()
  
    useEffect(()=>{
      usuarioId=localStorage.getItem("userid")
      console.log(usuarioId)
      if (!Number(usuarioId)){
       router.replace("./")}
      useFetch.getUsuarioPorId(usuarioId)
      .then((data)=>{
        setUsuario(data[0])
        useFetch.getItems(usuarioId)
        .then((data)=>{
          console.log(data)
          setItems(data)
        })
        .then(
          useFetch.getInventario(usuarioId)
          .then((data)=>{
            console.log(data)
            setInv(data)
          })
          )
      })
    },[])
 

    useEffect(()=>{
      if(inv.length!=0&&items.length!=0&&Object.keys(usuario).length!=0){
        setLoading(false)
      }
      //mostrar/cargar items de la tienda
    },[inv,usuario,items])
    


  return (
    <>
    {loading?(<>
    <h1>Cargando tienda...</h1>
    
    </>):(<>
    <h1>Tienda</h1>
    <p>Tus puntos: {usuario.puntos}</p>
    
    </>)}
    </>
  );
}