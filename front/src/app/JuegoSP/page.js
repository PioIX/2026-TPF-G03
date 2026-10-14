"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
// ejemplo de uso del hook
import {useBlackJackLogic} from "@/hooks/useBlackjack"
import ArrCartas from "../Components/ArrCartas";
import Popup from 'reactjs-popup';


export default function JuegoSPPage() {
  const {usersum,dealsum,isuserturn,usercards,dealcards,reset,givedealcard,giveusercard,wl} = useBlackJackLogic()
  const router=useRouter()
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})

  const [loading,setLoading]=useState(true)
  const [disabled,setDisabled]=useState(true)
  const [open,setOpen]=useState(false)
  const [popupText,setPopupText]=useState("")




  //valores temporarios, se deben importar o poner en storage
  const usuarioId=1
  const puntosApostados=1

  useEffect(()=>{
        setOpen(false)
        useFetch.getUsuarioPorId(usuarioId)
        .then((data)=>{
          setUsuario(data.message)
        })
        .then(
          useFetch.getEstadisticaDeUsuario(usuarioId)
          .then((data=>{
            setEstadistica(data)
          }))
        )
      },[])

  useEffect(()=>{
    if (usuario && estadistica && loading){
      console.log("UF")
      givedealcard()
      //arreglar los valores de puntos siendo distintos en hook y en pantalla (seguramente culpa de setState)
      giveusercard()
      setLoading(false)
      setDisabled(false)
    }
      
  },[estadistica,usuario])

useEffect(()=>{
    if (wl==1){
      console.log("win")
      setDisabled(true)
      if(usersum==21){
        win(puntosApostados*3)
      }else{
        win(puntosApostados)
      }
    }else if(wl==-1){
        lose(puntosApostados)
    }
      
  },[wl])

useEffect(()=>{
  if(wl!=0){
    console.log()
    setOpen(true)
  }
      
  },[popupText])


  function hit(){
    let res = giveusercard()
    console.log(res)
    console.log(usercards)
  }

  function standaaaa(){
    if(wl==0){
      //timeout
      let res=givedealcard()
      console.log(res)
    }
  }

  function stand(){
    console.log(wl)
    const loop = () => {
      console.log("in loop")
       while (wl === 0) {
        console.log("in while")
       if (wl === 0) {
           let res=givedealcard()
           console.log(res)
        }

        if (wl === 0) setTimeout(loop, 1000);
    }}
    loop();
}


  function win(points){
    setPopupText("Ganaste")
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
    useFetch.putPoints(usuario.points+points,usuarioId)
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
    useFetch.putPoints(usuario.points-points,usuarioId)

  }



  return (
    <>
    {(loading)?(
      <>
      <header><button disabled>Volver</button></header>
       
        <section>
          <h2>Cargando cartas...</h2>
        </section>

        <section>
      <button disabled>Hit</button>
      <button disabled>Stand</button>
        </section>
     
      </>
    ):(
      <>
      {(disabled)?(
        <>

        <header><button onClick={()=>{router.back()}}>Volver</button></header>
        <section>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={usercards}></ArrCartas>
          <ArrCartas cards={dealcards}></ArrCartas>
        </section>

        <section>
      <button disabled>Hit</button>
      <button disabled>Stand</button>
        </section>
      </>
      ):(
        <>
        <header><button onClick={()=>{router.back()}}>Volver</button></header>
        <section>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={usercards}></ArrCartas>
          <ArrCartas cards={dealcards}></ArrCartas>
        </section>

        <section>
      <button onClick={()=>{hit()}}>Hit</button>
      <button onClick={()=>{stand()}}>Stand</button>
        </section>
        
        <Popup open={open} onClose={()=>{setOpen(false)}}>
          {(usuario)?(
            <div>
            <h2>{popupText}</h2>
            <ul>
              <li>Dealer: {dealsum}</li>
              <li>Vos: {usersum}</li>
              <li>Tu dinero: {usuario.points}</li>
            </ul>
            {/*Chequear si usuario puede jugar con misma apuesta:
            si puede, botón para hacerlo, botón para cambiar apuesta, botón para volver
            si no, botón para cambiar apuesta y botón para volver (posiblemente con el otro deshabilitado)*/}
            <button>Volver a jugar</button>
          </div>       

          ):(
            <p>no deberías ver esto</p>
          )}
             
        </Popup>
        </>
      )}
      </>
      
    )}
    </>
  );
}