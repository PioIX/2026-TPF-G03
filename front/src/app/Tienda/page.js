"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import StoreList from "../components/StoreList";
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
    const [fondos,setFondos]=useState([])
    const [misc,setMisc]=useState([])

    const [usuario,setUsuario]=useState({})
    const [inv,setInv]=useState([])
    const [loading,setLoading]=useState(true)
    let t=-2
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
      if(inv.length!=0&&fondos.length!=0&&Object.keys(usuario).length!=0&&misc.length!=0){
        setLoading(false)
      }
      //mostrar/cargar items de la tienda
    },[inv,usuario,fondos,misc])
    
    useEffect(()=>{
      let f=[]
      let m=[]
      items.map((it)=>{
        if(it.name.includes("Fondo")){
          f.push(it)
        }else{
          m.push(it)
        }
        })

        setFondos(f)
        setMisc(m)
      //mostrar/cargar items de la tienda
    },[items])

    function estaEnInv(id){
      console.log("func")
      console.log(id)
      let temp=-1
      let found=false
        inv.map((item,i)=>{
          if (item.itemid==id){
            if(item.active){
              console.log("BA")
              temp= 1
              found=true
            }else{
              console.log("B")
              temp= 0
              found=true

            }
          }
        })
        if(!found){
          console.log("N")
        }
      return temp
    }
  
    function equip(){

    }
    function unequip(){
      
    }
    function buy(){
      
    }

  return (
    <>
    {loading?(<>
    <h1>Cargando tienda...</h1>
    
    </>):(<>
    <h1>Tienda</h1>
    <p>Tus puntos: {usuario.points}</p>
    <div>
      <h2>Fondos</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={fondos} estaEnInv={estaEnInv}></StoreList>
     <h2>Items</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={misc} estaEnInv={estaEnInv}></StoreList>
    </div>
    
    </>)}
    </>
  );
}