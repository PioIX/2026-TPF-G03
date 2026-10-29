"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./Home.module.css";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};


/*MASTERLIST DE COSAS QUE FALTAN:

-PIPIS CON FUNCIONALIDAD
-PODER MOVER A PIPI
-VER DONDE PONER LOS ICONOS
-CSSS LOL LOL
-MULTIJUGADOR CON SALA:
  -Sala sin dealer para competir entre jugadores (solo un ganador)
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
-puntos de apuesta de la sala vienen de base de datos (junto con otra info de sala)
-que se pueda jugar en multijugador lol lol
-ver cómo enviaría el socket la info de resultado de partida
-limpiar host disconnect, corre demasiadas veces (probablmemente por el disconnecting)
-rari que cuando hay 3 localhost 2 automaticamente se unen a la sala
-tambien kickear al host cuando se desconecteeee (?)
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
  const [Erropen,setErropen]=useState(false)
  const [errM,setErrM]=useState("")


  const [avRooms,setAvRooms]=useState(null)

  const { socket, isConnected } =useSocket()



  const [valueError,setValueError]=useState(false)
  const [puntosA,setPuntosA]=useState(1)

  let usuarioId = 0 
  const router = useRouter()
  const searchParams=useSearchParams()
  useEffect(()=>{
    let err=searchParams.get("err")
    if(err==1){
      setErrM("Host desconectado")
    }
    usuarioId=localStorage.getItem("userid")
    console.log(usuarioId)
    if (!Number(usuarioId)){
     router.replace("./")}
    useFetch.getUsuarioPorId(usuarioId)
    .then((data)=>{
      setUsuario(data[0])
    })
  },[])

  useEffect(()=>{
    if(usuario && Object.keys(usuario).length!=0){
      setLoading(false)
    }
  },[usuario])

  useEffect(()=>{
    if(Eopen){
      cargarEst()
    }
  },[Eopen])


  useEffect(()=>{
    if(errM){
      setErropen(true)
    }
  },[errM])
  
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
      console.log(socket.id)
      socket.on("allRooms",(data)=>{
        let rooms=data.message
        console.log(rooms)
        setAvRooms(rooms)
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
      socket.on("created",({userId})=>{
        if(userId==localStorage.getItem("userId")){

          router.push(`/JuegoMJ?room=${userId}`)

        }
      })
    },[socket])
  
  function logout(){
    localStorage.setItem("userid",0)
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
              </div>
              <button className={clsx(styles.btn, styles.small)} onClick={()=>{socket.emit("roomExists",{roomId:room.roomId,userId:usuario.id})}}>Unirse</button>
              </div>)}
              </div>):(<>
              <p className={styles.popupText}>No hay salas disponibles</p>
              </>)}
              </>):(<>
              <p className={styles.popupText}>cargando salas...</p>
              </>)}
              
            <div className={styles.popupActions}>
            <button className={styles.btn} onClick={()=>{socket.emit("createRoom",{userId:usuario.id})}}>Crear sala</button>
            <button className={styles.btn} onClick={()=>{setMopen(false)}}>Volver</button>
            </div>
              </div>   
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
