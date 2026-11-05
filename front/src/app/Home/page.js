"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./page.module.css";
import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};


/*MASTERLIST DE COSAS QUE FALTAN:


-PIPIS CON FUNCIONALIDAD
-CSS
-MULTIJUGADOR CON SALA:
  -Modo loco: los jugadores pueden elegir restarle o sumarle a otro (limitado)
-IMPLEMENTAR REGLAS COMO SEGURO O RENDIRSE, SPLIT O DOBLE



NO NECESARIOS:
-IMPLEMENTAR REGLAS COMO SEGURO O RENDIRSE, SPLIT O DOBLE
-PERSONALIZACION DEL MAZO
-ANIMACIONES DE CARTAS
-PODER SUBIR IMAGENES DE FONDO
*/


/*Hacer ahora:
-hacer sección de reglas/instrucciones/settings
-ver como mostrar datos de partida/cartas de oponentes/desconectados y hold
-ver si deshabilitar pipis en multijugador
-añadir pipis
-añdir mas items
-pipi visual
-poner página con carga en el gatcha / visual

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
  const nodeRef = useRef(null);
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
        if(estaEnInv(item.id)>-1){
          it.push(item)
        }else{
          it.push({name:item.name,id:item.id,imgsrc:`spr/shadow${item.id}.png`})
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
    <div className={clsx(styles.page, pixel.className)}>

    {(loading)?(
      <>
        <h1 className={styles.loading}>Cargando...</h1>
      </>
    ):(
      <>
      

          <header className={styles.header}>
          <button className={clsx(styles.btn, styles.small)} onClick={()=>{setLopen(true)}}>Logout</button>
          <button className={clsx(styles.btn, styles.small)} onClick={()=>{setEopen(true)}}>Estadistica</button>
        </header>


        <div className={styles.titleWrap}>
          <h1 className={styles.title}> Blackjack </h1>
        </div>

        <section className={styles.menu}>
            <button className={styles.btn} onClick={()=>{router.push("/Tienda")}}>Tienda</button>
            <button className={styles.btn} onClick={()=>{setPopen(true)}}>Ir al juego</button>
            <button className={styles.btn} onClick={()=>{router.push("/Ranking")}}>Ranking</button>
            <button className={styles.btn} onClick={()=>{setMopen(true)}}>Multijugador</button>


            <div> 
            {shownItems.map((it,i)=> i<2?(
              <Draggable nodeRef={nodeRef} key={i}>
              <img  src={it.imgsrc} ref={nodeRef} className={styles.drags}></img>
              </Draggable>
            ):(
              null
            )
            )}
         <hr className={styles.acheerre}></hr>
            </div>
          
            <div>
        {shownItems.map((it,i)=> i>=2?(
          (it.imgsrc.includes("shadow"))?(
              <Draggable nodeRef={nodeRef} key={i} disabled>
              <img  src={it.imgsrc} ref={nodeRef} className={styles.drags}></img>
              </Draggable>

          ):(
            <Draggable nodeRef={nodeRef} key={i}>
              <img  src={it.imgsrc} ref={nodeRef} className={styles.drags}></img>
              </Draggable>
          )
            ):(
              null
            )
            )}
        <hr className={styles.acheerre}></hr>
           </div>

        </section>

        {/*POPUPS*/}
        {/*Apuesta para comenzar juego*/}
        <Popup open={Popen} onClose={()=>{setPopen(false)}} closeOnDocumentClick={false} {...popupProps}>
        {usuario&&
          <div className={clsx(styles.popupBox, pixel.className)}>
            <h2 className={styles.popupTitle}>¿Cuántos puntos quiere apostar?</h2>
            <p className={styles.popupText}>Tus puntos: {usuario.points}</p>
            <input className={styles.input} onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
            {valueError&&<p className={styles.error}>Valor inválido</p>}
            <button className={styles.btn} onClick={()=>{
              if((puntosA>0 && puntosA<=usuario.points) || puntosA==1){
                setDisabled(true)
                setPopen(false);
                setValueError(false)
                sessionStorage.setItem("puntosApostados",puntosA)
                router.push("./JuegoSP")
              }else{
                setValueError(true)
              }}}>Comenzar</button>
      
                </div>       
                }
       </Popup>


       {/*Multijugador*/}
        <Popup open={Mopen} onClose={()=>{setMopen(false)}} closeOnDocumentClick={false} {...popupProps}>
          {usuario&&
            <div className={clsx(styles.popupBox, pixel.className)}>
              <h2 className={styles.popupTitle}>Salas multijugador</h2> 
              {(avRooms)?(<>
                {(avRooms.length>0)?(<div className={styles.roomList}>
                  {avRooms.map((room,i)=><div className={styles.room} key={i}>
                    <div className={styles.roomInfo}>
                      <p>Sala de {room.ownerName}</p>
                      <p>{room.usersCount} usuario(s)</p>
                      <p>Apuesta: ${room.apuesta}</p>
                    </div>
                      {(disabled)?(
                        <button disabled className={clsx(styles.btn, styles.small)}>Unirse</button>
                      ):(
                        <>
                          <p>{errM}</p>
                          <button className={clsx(styles.btn, styles.small)} onClick={()=>{if(pointCheck(room.apuesta)){setDisabled(true);router.push(`/JuegoMJ?room=${room.roomId}`)}}}>Unirse</button>
                        </>
                      )}
                  </div>)}
                  </div>):(<>
                <p className={styles.popupText}>No hay salas disponibles</p>
              </>)}
              </>):(<>
                <p className={styles.popupText}>cargando salas...</p>
              </>)}
              
            <div className={styles.popupActions}>
              
               {(disabled)?(<>
                <button disabled>Crear sala</button>
                <button disabled>Volver</button>  
               </>):(<>
                <button className={styles.btn} onClick={()=>{setAopen(true);setMopen(false);setErrM("")}}>Crear sala</button>
                <button className={styles.btn} onClick={()=>{setMopen(false)}}>Volver</button>
               </>)} 
            </div>  
          </div>}
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
       <Popup open={Eopen} onClose={()=>{setEopen(false)}} closeOnDocumentClick={false} {...popupProps}>
          {usuario&&
          <div className={clsx(styles.popupBox, pixel.className)}>
            {(eloading)?(
                <h2 className={styles.popupTitle}>Cargando estadistica....</h2>
            ):(
              <>
                <div className={styles.stats}>
                <p className={styles.stat}>Partidas ganadas: {estadistica.wins}</p>
                <p className={styles.stat}>Partidas perdidas: {estadistica.losses}</p>
                <p className={styles.stat}>Racha actual: {estadistica.streak}</p>
                <p className={styles.stat}>Puntos perdidos: {estadistica.points_lost}</p>
                <p className={styles.stat}>Puntos actuales: {usuario.points}</p>
                <p className={styles.stat}>Cantidad de items: {estadistica.cant_items}</p>
                </div>
              <button className={styles.btn} onClick={()=>{setEopen(false)}}>Cerrar</button>
              </>   
            )}
            </div>
          }
       </Popup>


        {/*Logout*/}
        <Popup open={Lopen} onClose={()=>{setLopen(false)}} closeOnDocumentClick={false} {...popupProps}>
          {usuario&&
              <div className={clsx(styles.popupBox, pixel.className)}>
              <h2 className={styles.popupTitle}>¿Está seguro de que quiere cerrar sesión?</h2> 
              <div className={styles.popupActions}>
              <button className={styles.btn} onClick={()=>{setLopen(false)}}>Volver</button>
              <button className={styles.btn} onClick={()=>{logout()}}>Cerrar sesión</button>
              </div>
              </div>   
          }
       </Popup>
    </>)}
    </div>
  );
}
