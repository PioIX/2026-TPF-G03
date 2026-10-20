"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';

export default function HomePage() {
  const [estadistica,setEstadistica]=useState({})
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)
  const [eloading,seteLoading]=useState(true)
  const [Popen,setPopen]=useState(false)
  const [Eopen,setEopen]=useState(false)
  const [Lopen,setLopen]=useState(false)

  const [valueError,setValueError]=useState(false)
  const [puntosA,setPuntosA]=useState(1)

  let usuarioId = 0 /*(usuarioLogueado lo importamos de login)*/
  const router = useRouter()

  useEffect(()=>{
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
    if(estadistica && Object.keys(estadistica).length!=0){
      seteLoading(false)
    }
  },[estadistica])

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
    <>
    {(loading)?(
      <>
        <h1>Cargando...</h1>
      </>
    ):(
      <>
      
    
          <header>
          <button onClick={()=>{setLopen(true)}}></button>
          <button onClick={()=>{setEopen(true)}}></button>
        </header>

        <div>
          <h1> Blackjack </h1>
        </div>

        <section>
            <button onClick={()=>{router.push("/Tienda")}}>Tienda</button>
            <button onClick={()=>{setPopen(true)}}>Ir al juego</button>
            <button onClick={()=>{router.push("/Ranking")}}>Ranking</button>
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
            <button onClick={()=>{
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