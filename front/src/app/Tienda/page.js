"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import StoreList from "@/components/StoreList";
import Popup from 'reactjs-popup';

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
    const [Iloading,setILoading]=useState(false)
    const [open,setOpen]=useState(false)


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
          setItems(data)
        })
        .then(
          useFetch.getInventario(usuarioId)
          .then((data)=>{
            setInv(data)
          })
          )
      })
    },[])
 

    useEffect(()=>{
      if(Iloading){
        useFetch.getInventario(usuario.id)
          .then((data)=>{
            setInv(data)
            setLoading(true)
          })
          
      }
    },[Iloading])

    useEffect(()=>{
      if(Iloading){
        setILoading(false)
        setLoading(true)
      }
    },[inv])

    useEffect(()=>{
      if(inv.length!=0&&fondos.length!=0&&Object.keys(usuario).length!=0&&misc.length!=0&&loading){
        setLoading(false)
      }
    },[usuario,fondos,misc,loading,inv])
    
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
    },[items])

    function estaEnInv(id){
      let temp=-1
        inv.map((item,i)=>{
          if (item.itemid==id){
            if(item.active){
              temp= 1
            }else{
              temp= 0

            }
          }
        })
  
      return temp
    }
  

    function equip(item){
      //check si otro item del mismo tipo está equipado
      let act=inv.filter((i)=>i.active)
      let t
      let f=0
      let m=0
      if(act.length!=0){
        act.map((it)=>(
          useFetch.getItemPorId(it.itemid)
          .then((data)=>{
            t=data[0]
            if(t.name.includes("Fondo")){
               f=t.id
              if(item.name.includes("Fondo")){
                useFetch.deactivateItem(f,usuario.id)
                 .then(()=>{
                  setILoading(true)
                })
              }
            }else{
              m=t.id
              if(!item.name.includes("Fondo")){
                useFetch.deactivateItem(m,usuario.id)
                .then(()=>{
                  setILoading(true)
                })
              }
            }
          })
        ))
      }
      useFetch.activateItem(item.id,usuario.id)
      .then(()=>{setILoading(true)})
    }
    
    function unequip(item){
      useFetch.deactivateItem(item.id,usuario.id)
      .then(()=>{setILoading(true)})
    }

    //chequear si funciona la compra
    function buy(item){
      if(usuario.points<item.price){
        console.log("Puntos insuficientes")
        setOpen(true)
      }else{
        //popup para confirmar compra
        let e
        useFetch.getEstadisticaDeUsuario(usuario.id)
        .then((data)=>{ 
          e=data[0]
          let newitem ={
            userid: usuario.id,
            itemid: item.id,
            active: 0   
            }
          useFetch.postItemPorUsuario(newitem)
          .then(()=>{

            useFetch.putEstadistica({cant_items: e.cant_items+1, userid: usuario.id}),
            usuario.points-=item.price,
            useFetch.putPoints(usuario.points,usuario.id)
            .then(
              ()=>{setILoading(true)})
            
          }
          )
        })
      }
    }



  return (
    <>
    {loading?(<>
    <h1>Cargando tienda...</h1>
    
    </>):(<>
    <h1>Tienda</h1>
    <p>Tus puntos: {usuario.points}</p>
    <div style={{height:"400px",overflowY:"scroll"}}>
      <h2>Fondos</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={fondos} estaEnInv={estaEnInv}></StoreList>
     <h2>Items</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={misc} estaEnInv={estaEnInv}></StoreList>
    </div>
      <button onClick={()=>{router.back()}}>Volver</button>


       <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={true}>
              {usuario&&
                <div>
                  <h2>No tiene suficientes puntos para hacer esta compra</h2>
                  <button onClick={()=>{setOpen(false)}}>Cerrar</button>
                </div>       
                      }
             </Popup>

    </>)}
    </>
  );
}