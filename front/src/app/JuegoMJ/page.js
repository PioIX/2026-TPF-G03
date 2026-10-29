"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import {useMultiBlackJack} from "@/hooks/useMultiBlackJack"
import ArrCartas from "@/components/ArrCartas";
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";


export default function JuegoMJPage() {
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
  const [userArr,setUserArr]=useState([])

  const [started,setStarted]=useState(false)
  const [ended,setEnded]=useState(false)

  const [startDisabled,setStartDisabled]=useState(true)
  const [heldText,setHeldText]=useState("Esperando a los otros jugadores..")

//hay que guardar los datos de los usuarios para mostrarlos (saber nombre y si están conectados)



  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)
  let usuarioId=0

  useEffect(()=>{
        usuarioId = localStorage.getItem("userid")
        let ptemp=1
        //CAMBIAR ESTO A PUNTOS DE LA SALA
        setPopupText("")
        setOpen(false)
        if(ptemp){
          setPuntosA(ptemp)
        }else{
          setPuntosA(1)
        }
        if(!usuario || !estadistica || Object.keys(usuario).length==0){
          useFetch.getUsuarioPorId(usuarioId)
          .then((data)=>{
            setUsuario(data[0])
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
          console.log("joined")
          setInRoom(true)
        }
        setMembers(data.users)
        
      })
      //usuario no recibe el error
      socket.on("error",({type})=>{
        console.log("Error recieved")
        router.replace(`/Error?err=${type}`)
      })

      socket.on("left",(data)=>{
        setMembers(data.users)
      })
      socket.on("msg",(data)=>{
        console.log(data)
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
            //setear el usuario desconectado en gris o algo lol
          }
        
      })
    }

    //eventos del juego
     socket.on("started",()=>{
        console.log("started recieved")
        setStarted(true)
      })
      socket.on("ended",({room,userArr,winner})=>{
        setEnded(true)
        setUserArr(userArr)
        console.log(usuario)
        setHeldText("")
        if(winner[0]==usuario.username){
          win(puntosA)
        }else if(winner.length==0){
          setPopupText("No hubo ganador")
        }else{
          lose(puntosA)
        }
      })
      socket.on("held",({user})=>{
        if (user!=usuario.username){
          //poner que este usuario ya hizo hold
        }
      })
  },[socket,loading])


  //ver si conviene que el back le mande a cada uno su estado o que envie el ganador y ahí se decida


useEffect(()=>{
  if(popupText){

    setOpen(true)
  }

  },[popupText])

  function startGame(){
    console.log("start")
    socket.emit("start",{roomId:searchParams.get("room")})
   
  }
  function hit(){
    let res = giveusercard()
    console.log(res)
  }

  function stand(){
    setHeld(true)

  }



  function win(points){
    setPopupText("Ganaste")
    console.log(points)
    let newE={
      userid:usuarioId,
      wins:Number(estadistica.wins)+1,
      losses:estadistica.losses,
      played:Number(estadistica.played)+1,
      streak:Number(estadistica.streak)+1,
      points_lost:Number(estadistica.points_lost),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points+Number(points),usuarioId)
    console.log(points)
    usuario.points+=Number(points)
    console.log(usuario.points)
  }

  function lose(points){
    setPopupText("Perdiste")
    let newE={
      userid:usuarioId,
      wins:estadistica.wins,
      losses:Number(estadistica.losses)+1,
      played:Number(estadistica.played)+1,
      streak:0,
      points_lost:estadistica.points_lost+Number(points),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points-Number(points),usuarioId)
    console.log(points)
    usuario.points-=Number(points)
    console.log(usuario.points)

  }



  return (
    <>
    {(loading || !socket)?(
      <>
      <header><button disabled>Volver</button></header>
       
        <section>
          <h2>Cargando...</h2>
        </section>
      {/*Mostrar un mejor framework*/}
        <section>
      
        </section>
     
      </>
    ):(

    (started)?(
      <>
    {/*  <header><button onClick={()=>{reset();router.back()}}>Volver</button></header>*/}
        <section>
          <div>
            <p>Vos: {sum}</p>
          </div>
          <ArrCartas cards={ucards}></ArrCartas>
          {/*Cartas de los otros usuarios dadas vuelta*/}
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
              
              {userArr.length>0&&
              <>
              {userArr.map((u,i)=>
              <li key={i}>{u[0]}: {u[1].sum}</li>
              )}
              </>}
              <li>Tu dinero: {usuario.points}</li>
            </ul>
          </div>       
          }
        </Popup>
        </>
      
     
    ):(
      <>
      {members.length>0&&
      <>
      <h2>Miembros en la sala:</h2>
      {members.map((m,i)=><p key={i}>{m}</p>)}
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
      <button onClick={()=>{router.replace("/Home")}}>Volver</button>
      </>
    )
      
    ) 
    }
        
    </>
  );
}
