"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";


/*MASTERLIST DE COSAS QUE FALTAN:


-PODER MOVER A PIPI
-VER DONDE PONER LOS ICONOS
-CSSS LOL LOL
-MULTIJUGADOR CON SALA:
  -Modo loco: los jugadores pueden elegir restarle o sumarle a otro (limitado)
-IMPLEMENTAR REGLAS COMO SEGURO O RENDIRSE, SPLIT O DOBLE

NO NECESARIOS:
-ENTRETENIMIENTO EN SALA DE ESPERA (DUDOSO)
-PODER MOVER LAS LETRAS DEL TITULO
-PERSONALIZACION DEL MAZO
-ANIMACIONES DE CARTAS
-PODER SUBIR IMAGENES DE FONDO
*/


/*Hacer ahora:
-hacer sección de reglas/instrucciones
-ver como mostrar datos de partida/cartas de oponentes/desconectados y hold
-ver si deshabilitar pipis en multijugador
-testear pipis
-ver qué hacer con items
-mover a pipi

*/

export default function HomePage() {
  const [estadistica,setEstadistica]=useState({})
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)
  const [eloading,seteLoading]=useState(true)
  const [Popen,setPopen]=useState(false)
  const [Eopen,setEopen]=useState(false)
  const [Lopen,setLopen]=useState(false)
  const [Mopen,setMopen]=useState(false)
  const [Aopen,setAopen]=useState(false)

  const [Erropen,setErropen]=useState(false)
  const [disabled,setDisabled]=useState(false)
  const [pipi,setPipi]=useState(null)
  const [item,setItem]=useState(null)
  const [fondo,setFondo]=useState(null)
  const [inv,setInv]=useState(null)
  const [items,setItems]=useState(null)
  const [errM,setErrM]=useState("")
  const [apuesta,setApuesta]=useState(1)
  const [shownItems,setShownItems]=useState(null)

  const [avRooms,setAvRooms]=useState(null)

  const { socket, isConnected } =useSocket()



  const [valueError,setValueError]=useState(false)
  const [puntosA,setPuntosA]=useState(1)
  let f;
 let m;
 let p;
  let usuarioId = 0 
  const router = useRouter()
  const searchParams=useSearchParams()
  useEffect(()=>{
    usuarioId=localStorage.getItem("userid")
    console.log(usuarioId)
    if (!Number(usuarioId)){
     router.replace("./")}
    useFetch.getInventario(usuarioId)
        .then((data)=>{
          setInv(data)
        })
    useFetch.getItems()
    .then((data)=>{
          setItems(data)
    })
    useFetch.getUsuarioPorId(usuarioId)
    .then((data)=>{
      setUsuario(data[0])
      if(localStorage.getItem("Fondo")){
        setFondo(JSON.parse(localStorage.getItem("Fondo")))
      }
      if(localStorage.getItem("Pipi")){
        setPipi(JSON.parse(localStorage.getItem("Pipi")))
      }
      if(localStorage.getItem("Misc")){
        setItem(JSON.parse(localStorage.getItem("Misc")))
      }
    })
  },[])

  useEffect(()=>{
    let it=[]

    if(usuario && Object.keys(usuario).length!=0 &&inv&&items){

      items.filter((it)=>!it.name.includes("Pipi")&&!it.name.includes("Fondo")).map((item,i)=>{ 
        if(estaEnInv(item.id)){
          it.push(item)
        }else{
          it.push({name:item.name,id:item.id,imgsrc:`/shadow${item.name}`})
        }
      }
      )
      console.log(it)
      setShownItems(it)

    }
  },[usuario,inv,items])

  useEffect(()=>{
    
    if(usuario && Object.keys(usuario).length!=0 &&inv&&items&&shownItems){

      setLoading(false)
      setDisabled(false)
    }
  },[usuario,inv,shownItems])

  useEffect(()=>{
    if(Eopen){
      cargarEst()
    }
  },[Eopen])



  
  useEffect(()=>{
    if(estadistica && Object.keys(estadistica).length!=0){
      seteLoading(false)
    }
  },[estadistica])

  useEffect(()=>{
    if(Mopen){
      socket.emit("listRooms")
    }
  },[Mopen])


  useEffect(()=>{
      if(!socket){
        return
      }
      
      socket.on("allRooms",(data)=>{
        let rooms=data.message
        console.log(rooms)
        setAvRooms(rooms)
      })
      socket.on("error",({type})=>{
       router.replace(`/Error?err=${type}`)
      })
      socket.on("connect",()=>{
        console.log(socket.id)
      })
      socket.on("roomChange",()=>{
        socket.emit("listRooms")
      })
      socket.on("verify",({exists,roomId,userId})=>{
      
        if(userId==localStorage.getItem("userid")){
          if(exists){
            router.push(`/JuegoMJ?room=${roomId}`)
          }else{
            router.push(`/Error?err=2`)
          }
        }
      })
      socket.on("created",({roomId})=>{
        router.replace(`/JuegoMJ?room=${roomId}`)
      })
    },[socket])
  

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

  function logout(){
    localStorage.setItem("userid",0)
    localStorage.removeItem("Fondo")
    localStorage.removeItem("Pipi")
    localStorage.removeItem("Misc")
    router.replace("./")
  }
  
  function cargarEst(){
     if(estadistica && Object.keys(estadistica).length!=0){
      return
    }
    setEstadistica(()=>{
      useFetch.getEstadisticaDeUsuario(usuario.id)
      .then((data)=>{
        setEstadistica(data[0])
      })
    }
    )
  }

    function pointCheck(points){
    setErrM("")
    if(points<1){
      setErrM("Cantidad inválida")
    }else{

      if(usuario.points>=points){
        return true
      }else{
        setErrM("Puntos insuficientes")
        return false
      }
    }
  }
  

  return (
    <>
   
    {(loading)?(
      <>
        <h1>Cargando...</h1>
      </>
    ):(
      <>
      
    
          <header>
          <button onClick={()=>{setLopen(true)}}>Logout</button>
          <button onClick={()=>{setEopen(true)}}>Estadistica</button>
        </header>
      {fondo&&
          <h2>Fondo equipado:{fondo.name}</h2>}
        {pipi&&
          <h2>Pipi equipado:{pipi.name}</h2>}
        {item&&
          <h2>Item equipado:{item.name}</h2>}
        <div>
          <h1> Blackjack </h1>
        </div>
          
        <section>
            <button onClick={()=>{router.push("/Tienda")}}>Tienda</button>
            <button onClick={()=>{setPopen(true)}}>Ir al juego</button>
            <button onClick={()=>{router.push("/Ranking")}}>Ranking</button>
            <button onClick={()=>{setMopen(true)}}>Multijugador</button>


        </section>
          <section>
            {shownItems.map((it,i)=>(
              <img src={it.imgsrc}></img>
            ))}
          </section>

        {/*POPUPS*/}
        {/*Apuesta para comenzar juego*/}
        <Popup open={Popen} onClose={()=>{setPopen(false)}} closeOnDocumentClick={false}>
        {usuario&&
          <div>
            <h2>¿Cuántos puntos quiere apostar?</h2>
            <p>Tus puntos: {usuario.points}</p>
            <input onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
            {valueError&&<p>Valor inválido</p>}
            {disabled?(
              <button disabled>Comenzar</button>
            ):(
            <button onClick={()=>{
              if((puntosA>0 && puntosA<=usuario.points) || puntosA==1){
                setDisabled(true)
                setPopen(false);
                setValueError(false)
                sessionStorage.setItem("puntosApostados",puntosA)
                router.push("./JuegoSP")
              }else{
                setValueError(true)
              }}}>Comenzar</button>
            )}
                </div>       
                }
       </Popup>


       {/*Multijugador*/}
        <Popup open={Mopen} onClose={()=>{setMopen(false);setErrM("")}} closeOnDocumentClick={false}>
          {usuario&&
              <>
              <h2>Salas multijugador</h2> 
              
              <p>(pipis deshabilitados)</p>
              {(avRooms)?(<>
              {(avRooms.length>0)?(<>
              {avRooms.map((room,i)=><div key={i}>
              <p>Sala de {room.ownerName}</p>
              <p>{room.usersCount} usuario(s)</p>
              <p>Apuesta: ${room.apuesta}</p>
              {/*<button onClick={()=>{socket.emit("roomExists",{roomId:room.roomId,userId:usuario.id})}}>Unirse</button>*/}
              {(disabled)?(
                <button disabled>Unirse</button>
              ):(
                <>
                <p>{errM}</p>
                <button onClick={()=>{if(pointCheck(room.apuesta)){setDisabled(true);router.push(`/JuegoMJ?room=${room.roomId}`)}}}>Unirse</button>
              </>
              )}
              

              </div>)}
              </>):(<>
              <p>No hay salas disponibles</p>
              </>)}
              </>):(<>
              <p>cargando salas...</p>
              </>)}
             {(disabled)?(<>
            <button disabled>Crear sala</button>
            <button disabled>Volver</button>
             </>):(<>
            <button onClick={()=>{setAopen(true);setMopen(false);setErrM("")}}>Crear sala</button>
            <button onClick={()=>{setMopen(false)}}>Volver</button>
             </>)} 
           
              </>   
          }
       </Popup>

        <Popup open={Aopen} onClose={()=>{setAopen(false)}} closeOnDocumentClick={false}>
          {usuario&&
             <>
             <h2>Ingrese puntos a apostar:</h2>
            <input type="number" value={apuesta} onChange={(e)=>{setApuesta(e.target.value)}}></input>
            <p>{errM}</p>
            <button onClick={()=>{if(pointCheck(apuesta)){setDisabled(true);socket.emit("createRoom",{user:usuario.username,socketId:socket.id,roomId:usuario.id,apuesta:apuesta});}}}>Crear</button>
            <button onClick={()=>{setAopen(false)}}>Volver</button>
              </>   
          }
       </Popup>
              
        {/*Estadística de usuario*/}
       <Popup open={Eopen} onClose={()=>{setEopen(false)}} closeOnDocumentClick={false}>
          {usuario&&
          <>
            {(eloading)?(
                <h2>Cargando estadistica....</h2>
            ):(
              <>
                <p>Partidas ganadas: {estadistica.wins}</p>
                <p>Partidas perdidas: {estadistica.losses}</p>
                <p>Racha actual: {estadistica.streak}</p>
                <p>Puntos perdidos: {estadistica.points_lost}</p>
                <p>Puntos actuales: {usuario.points}</p>
                <p>Cantidad de items: {estadistica.cant_items}</p>
              <button onClick={()=>{setEopen(false)}}>Cerrar</button>
              </>   
            )}
            </>
          }
       </Popup>


        {/*Logout*/}
        <Popup open={Lopen} onClose={()=>{setLopen(false)}} closeOnDocumentClick={false}>
          {usuario&&
              <>
              <h2>¿Está seguro de que quiere cerrar sesión?</h2> 
              <button onClick={()=>{setLopen(false)}}>Volver</button>
              <button onClick={()=>{logout()}}>Cerrar sesión</button>
              </>   
          }
       </Popup>
    </>)}
    </>
  );
}