"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import {useMultiBlackJack} from "@/hooks/useMultiBlackJack"
import ArrCartas from "@/components/ArrCartas";
import Popup from 'reactjs-popup';
import useSocket from "@/hooks/useSocket";


export default function JuegoMJPage() {
  const {sum,ucards,reset,giveusercard,wl,setWL} = useMultiBlackJack()
  const router=useRouter()
  const { socket, isConnected } = useSocket();
  const searchParams = useSearchParams();
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})
  const [loading,setLoading]=useState(true)
  const [disabled,setDisabled]=useState(true)
  const [open,setOpen]=useState(false)
  const [inRoom,setInRoom]=useState(false)
  const [members,setMembers]=useState([])
  const [started,setStarted]=useState(false)
  const [startDisabled,setStartDisabled]=useState(true)




  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)
  let usuarioId=0

  useEffect(()=>{
        usuarioId = localStorage.getItem("userid")
        let ptemp=1
        //CAMBIAR ESTO A PUNTOS DE LA SALA
        setWL(0)
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
        setDisabled(false)
      }
    }
  },[estadistica,usuario, loading])

    useEffect(()=>{
      if (members.length>1){
        setStartDisabled(false)
      }
  },[members])


  useEffect(()=>{
    if (!socket){
      return      
    }else{
      if(!inRoom && !loading){
        console.log("joining")
        socket.nickname=usuario.username
        let room=searchParams.get("room")
        socket.emit("joinRoom",{roomId:room, user:usuario.username,socketId:socket.id})
      }
     
       socket.on("joined",(data)=>{
        console.log(data)
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
        console.log(data)
        setMembers(data.users)
      })
      socket.on("msg",(data)=>{
        console.log(data)
      })
      socket.on("hostDisconnect",()=>{
        console.log("hostDisconnect")
        router.replace("/Error?err=1")
      })
       socket.on("disconnecting",()=>{
          setInRoom(false)
          console.log("desconectado")
        })
      
      socket.on("disconnected",(data)=>{
        console.log("usuario desconectado")
          let room=data.room
          let roomId=searchParams.get("room")
          console.log(room.ownerName)
          console.log(data.user)
          if(room.ownerName==data.user){
            console.log("host disconnect emitting")
            socket.emit("hostDisconnect",roomId)
          }else if(started){
            //setear el usuario desconectado en gris o algo lol
          }
          console.log("desconectado")
        
      })
    }

    //eventos del juego
     socket.on("started",()=>{
        setStarted(true)
      })
      socket.on("end",(data)=>{

      })
      socket.on("held",({user})=>{
        if (user!=usuario.username){
          //poner que este usuario ya hizo hold
        }
      })
  },[socket,loading])


  //ver si conviene que el back le mande a cada uno su estado o que envie el ganador y ahí se decida
useEffect(()=>{
    if (wl==1){
      setDisabled(true)
      if(usersum==21){
        win(parseInt(puntosA)*3)
      }else{
        win(puntosA)
      }
      }else if(wl==-1){
        setDisabled(true)
        lose(puntosA)
      }
      
  },[wl])


useEffect(()=>{
  if(wl!=0){
    setOpen(true)
  }
  },[popupText])

  function startGame(){
   socket.emit("start",{room:searchParams.get("room")})
   
  }
  function hit(){
    let res = giveusercard()
    console.log(res)
  }

  function stand(){
    //envia los datos al back de socket y espera
    socket.emit("hold",{username:usuario.username,roomId:searchParams.get("room"),cards:ucards,sum:sum})
    //poner graficos de usuario distintos o poner que espere
  }



  function win(points){
    setPopupText("Ganaste")
    console.log(points)
    let newE={
      userid:usuarioId,
      wins:estadistica.wins+1,
      losses:estadistica.losses,
      played:estadistica.played+1,
      streak:estadistica.streak+1,
      points_lost:estadistica.points_lost,
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points+parseInt(points),usuarioId)
    usuario.points+=parseInt(points)
  }

  function lose(points){
    setPopupText("Perdiste")
    let newE={
      userid:usuarioId,
      wins:estadistica.wins,
      losses:estadistica.losses+1,
      played:estadistica.played+1,
      streak:0,
      points_lost:estadistica.points_lost+parseInt(points),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points-parseInt(points),usuarioId)
    usuario.points-=parseInt(points)

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
          {(disabled)?(<>
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
              <li>Vos: {usersum}</li>
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
