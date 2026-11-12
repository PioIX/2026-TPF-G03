"use client"
import { Suspense, useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import {useMultiBlackJack} from "@/hooks/useMultiBlackJack"
import ArrCartas from "@/components/ArrCartas";
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";
import { connect } from "socket.io-client";
const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./page.module.css";
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });


function JuegoMJPage() {
  const {sum,ucards,reset,giveusercard,held,setHeld} = useMultiBlackJack()
  const router=useRouter()
  const { socket, isConnected } = useSocket();
  const searchParams = useSearchParams();
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})
  const [loading,setLoading]=useState(true)
  const [open,setOpen]=useState(false)
  const [inRoom,setInRoom]=useState(false)

  const [members,setMembers]=useState([])
  const [UserArr,setUserArr]=useState([])

  const [started,setStarted]=useState(false)
  const [ended,setEnded]=useState(false)

  const [startDisabled,setStartDisabled]=useState(true)
  const [heldText,setHeldText]=useState("Esperando a los otros jugadores..")
  const [errM,setErrM]=useState("")

  const [pipi,setPipi]=useState(null)
  const [item,setItem]=useState(null)
  const [fondo,setFondo]=useState(null)



  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)
  let usuarioId=0

  useEffect(()=>{
        usuarioId = localStorage.getItem("userid")
        setPopupText("")
        setOpen(false)
        
        if(!usuario || !estadistica || Object.keys(usuario).length==0){
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
          .then(
            useFetch.getEstadisticaDeUsuario(usuarioId)
            .then((data=>{
              setEstadistica(data[0])
            }))
          )


        }
      },[loading])


  useEffect(()=>{
    if (usuario && estadistica && loading){
      if(Object.keys(usuario).length!=0&&Object.keys(estadistica).length!=0){
        setLoading(false)
      }
    }
  },[estadistica,usuario, loading])

    useEffect(()=>{
      if (members.length>1){
        setStartDisabled(false)
      }else{
        setStartDisabled(true)
      }
  },[members])


 

    useEffect(()=>{
      if (started){
       giveusercard()
      }
  },[started])

    useEffect(()=>{
      if (held){
            //envia los datos al back de socket y espera
            socket.emit("updateHold",{username:usuario.username,roomId:searchParams.get("room"),cards:ucards,sum:sum})
          //poner graficos de usuario distintos o poner que espere
      }
  },[held])



  useEffect(()=>{
    if (!socket){
      return      
    }else{
      if(!inRoom && !loading){
        socket.nickname=usuario.username
        let room=searchParams.get("room")
        socket.emit("joinRoom",{roomId:room, user:usuario.username,socketId:socket.id})
      }
     
       socket.on("joined",(data)=>{
        if(data.user==usuario.username){
          setInRoom(true)
          console.log("apuesta")
          console.log(data.apuesta)
          setPuntosA(data.apuesta)
        } 
        let t=data.users.map((m)=>({username:m,hold:false,connected:true}))
        setMembers(t)
        
      })
      socket.on("error",({type})=>{
        router.replace(`/Error?err=${type}`)
      })

      socket.on("left",(data)=>{
        console.log("USER LEFT")
         let t=data.users.map((m)=>({username:m,hold:false,connected:true}))
        setMembers(t)
      })
      
      socket.on("hostDisconnect",()=>{
        router.replace("/Error?err=1")
      })
       socket.on("disconnecting",()=>{
          setInRoom(false)
          
        })
      
      socket.on("disconnected",(data)=>{
        console.log("usuario desconectado")
          let room=data.room
          let roomId=searchParams.get("room")
          if(room.ownerName==data.user){
            socket.emit("hostDisconnect",roomId)
          }else if(started){
            members.map((m,i)=>{
              if(m.username==data.user){
                let t = members
                t[i].connected=false
                setMembers(t)
              }
            })
          }
        
      })
    }

    //eventos del juego
     socket.on("started",()=>{
        setStarted(true)
      })
      socket.on("ended",({room,userArr,winner})=>{
        setEnded(true)
        setUserArr(userArr)
        setHeldText("")
        if(winner.length/2==userArr.length){
          setPopupText("Empate")
        }else{
          if(winner.includes(usuario.username)){
            win(Math.floor((puntosA*(userArr.length-(winner.length/2)))/(winner.length/2)))
          }else if(!winner[0]){
            setPopupText("No hubo ganador")
          }else{
            lose(puntosA)
          }

        }
      })
      socket.on("held",({user})=>{
         setMembers(prev => 
         prev.map((m, i) => 
         m.username ==user
          ? { ...m, hold: true } 
          : m 
        )
        );
        
      })
      socket.on("restart",()=>{
        console.log(usuario)
        if(Object.keys(usuario).length>0){

          if(pointCheck(puntosA)){
            restartGame()
          }else{
            socket.emit("leave",{roomId:searchParams.get("room"),user:usuario.username})
             router.replace("/Error?err=5")
          }
        }
      })

      return () => {
      socket.off("ended");
      };
  },[socket,loading,inRoom])




useEffect(()=>{
  if(popupText){

    setOpen(true)
  }

  },[popupText])

  function startGame(){
    socket.emit("start",{roomId:searchParams.get("room")})
   
  }
  function hit(){
    let res = giveusercard()
  }

  function stand(){
    setHeld(true)

  }

function restartGame(){
    reset()
    setOpen(false)
    setUserArr([])
    setStarted(false)
    setEnded(false)
    setInRoom(false)
    setPopupText("")

  }


  function win(points){
    console.log("WIN")
    console.log(points)
    console.log('usuario')
    console.log(usuario)
    let newE={
      userid:usuario.id,
      wins:Number(estadistica.wins)+1,
      losses:estadistica.losses,
      played:Number(estadistica.played)+1,
      streak:Number(estadistica.streak)+1,
      points_lost:Number(estadistica.points_lost),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points+Number(points),usuario.id)
    .then(()=>{
      console.log("done")
      let t = usuario
      t.points+=Number(points)
      setUsuario(t)
      setPopupText("Ganaste")

    })
    
  }

  function lose(points){
    console.log("LOSE")
    console.log(points)
    console.log('usuario')
    console.log(usuario)
    let newE={
      userid:usuario.id,
      wins:estadistica.wins,
      losses:Number(estadistica.losses)+1,
      played:Number(estadistica.played)+1,
      streak:0,
      points_lost:estadistica.points_lost+Number(points),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points-Number(points),usuario.id)
    .then(()=>{
      console.log("done")
      let t = usuario
      t.points-=Number(points)
      setUsuario(t)
      
      setPopupText("Perdiste")
    })
    

  }

  function pointCheck(points){
    setErrM("")
    points=Number(points)
      if(usuario.points>=points){
        return true
      }else{
        setErrM("Puntos insuficientes")
        return false
      
    }
  }
  

  return (
    <>
    <div>
    {(loading || !socket)?(
      <>
          <h1>Cargando...</h1>
     
      </>
    ):(

    (started)?(
      <>
        <section>
          {members.length>0&&
          <>
          {/*posiblemente marcar los usuarios desconectados en gris o algo*/}
          <div style={{display:"flex"}}>
          {members.map((m,i)=> m.username==usuario.username?<p key={i}></p>:
            <div key={i}>
            <p>{m.username}:</p>
            {/*lo que sea que diga cuando otro usuario ya hizo hold*/}
            {!m.connected?
            <img src="cartas/shadowcard.png"></img>
            :
            <>
            {m.hold?
            <img src="cartas/greencard.png"></img>
            :
              <img src="cartas/redcard.png"></img>
            }
            </>
            }
          {/*placeholder para carta dada vuelta*/}
            </div>
            
          )}
              </div>
          </>}
          <div>
            <p>Vos: {sum}</p>
          </div>
          <ArrCartas cards={ucards}></ArrCartas>
         
        </section>
        <section>
          {(held )?(<>
          <h2>{heldText}</h2>
          <button disabled>Hit</button>
          <button disabled>Stand</button>
          </>):(<>
          <button onClick={()=>{hit()}}>Hit</button>
          <button onClick={()=>{stand()}}>Stand</button>
          </>)}
        </section>
        <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={false} closeOnEscape={false}>
          {usuario&&
            <div>
            <h2>{popupText}</h2>
            <ul>
              
              {UserArr.length>0&&
              <>
              {UserArr.map((u,i)=>
              <li key={i}>{u[0]}: {u[1].sum}</li>
              )}
              </>}
              <li>Tu dinero: {usuario.points}</li>
            </ul>
          </div>       
          }
          
           {(searchParams.get("room")==usuario.id)?(
            <>
            <p>{errM}</p>
            <button onClick={()=>{if(pointCheck(puntosA)){socket.emit("restart",{roomId:searchParams.get("room"),user:usuario.username,socketId:socket.id,apuesta:puntosA})}}}>Volver a jugar</button>
           </>
           ):(
            <p>Esperando al administrador....</p>
           )}
           <button onClick={()=>{router.replace("/Home")}}>Home</button>
        </Popup>
        </>
      
     
    ):(
      <>
      {members.length>0&&
      <>
      <h2>Miembros en la sala:</h2>
      {members.map((m,i)=><p key={i}>{m.username}</p>)}
      </>}
      {(searchParams.get("room")==usuario.id)?(
        <>
        {(startDisabled)?(<>
        <button disabled>Comenzar partida</button>
        </>):(<>
        <button onClick={()=>{startGame()}}>Comenzar partida</button>
        </>)}
        
        </>
      ):(
        <>
      <h1>Esperando a que el administrador comienze la partida...</h1>
      </>
      )}
      <button onClick={()=>{console.log("volver");router.replace("/Home")}}>Volver</button>
      </>
    )
      
    ) 
    }
        </div>
    </>
  );
}


export default function JuegoMJ2Page(){
  const [fondo,setFondo]=useState(null)
  useEffect(()=>{
    if(localStorage.getItem("Fondo")){
        setFondo(JSON.parse(localStorage.getItem("Fondo")))
      }
    },[])
    
  return (
    <>
   {/* <Suspense fallback={<div className={clsx(styles.page, pixel.className)} style={{backgroundImage: fondo ? `url(${fondo.imgsrc})` :null,backgroundColor: !fondo ?  "#2a2a2a":null}}><h1 className={styles.loading}>Cargando...</h1></div>}>*/}
        <JuegoMJPage></JuegoMJPage>
   {/* </Suspense>*/}
    </>
  );
}