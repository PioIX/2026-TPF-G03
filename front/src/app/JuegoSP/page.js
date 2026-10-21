"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import {useBlackJackLogic} from "@/hooks/useBlackjack"
import ArrCartas from "../components/ArrCartas";
import Popup from 'reactjs-popup';


export default function JuegoSPPage() {
  const {usersum,dealsum,isuserturn,usercards,dealcards,reset,givedealcard,giveusercard,wl,setWL,setIsUserTurn} = useBlackJackLogic()
  const router=useRouter()
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})

  const [loading,setLoading]=useState(true)
  const [replay,setReplay]=useState(false)
  const [valueError,setValueError]=useState(false)
  const [disabled,setDisabled]=useState(true)
  const [open,setOpen]=useState(false)

  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)
  let usuarioId=0

  useEffect(()=>{
        usuarioId = localStorage.getItem("userid")
        let ptemp=sessionStorage.getItem("puntosApostados")
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
        givedealcard()
        giveusercard()
        setLoading(false)
        setDisabled(false)
      }
      
    }
      
  },[estadistica,usuario, loading])

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
    if(wl==0 && !isuserturn){
      stand()
    }
  },[dealsum])

useEffect(()=>{
  if(wl!=0){
    setOpen(true)
  }
  },[popupText])


  function hit(){
    let res = giveusercard()
    console.log(res)
  }

  function stand(){
    setDisabled(true)
    if(isuserturn){
      setIsUserTurn(false)
    }
    const timer = setTimeout(() => {
      if(wl==0 && dealsum<=usersum && dealsum<21){
        let res=givedealcard()
        console.log(res)
      }
      
    }, 1500);
    return () => clearTimeout(timer);
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
      <header><button onClick={()=>{reset();router.back()}}>Volver</button></header>
        <section>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={dealcards}></ArrCartas>
          <ArrCartas cards={usercards}></ArrCartas>
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
          {(usuario)?(
            <div>
            <h2>{popupText}</h2>
            <ul>
              <li>Dealer: {dealsum}</li>
              <li>Vos: {usersum}</li>
              <li>Tu dinero: {usuario.points}</li>
            </ul>
            {(replay)?(<>
            <p>¿Cuántos puntos quiere apostar?</p>
              <input onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
              {valueError&&<p>Valor inválido</p>}
            <button onClick={()=>{
              if((puntosA>0 && puntosA<=usuario.points) || puntosA==1){
                setOpen(false);
                setValueError(false)
                setReplay(false)
                setPopupText("")
                sessionStorage.setItem("puntosApostados",puntosA)
                reset()
                setLoading(true)

              }else{
                setValueError(true)
              }
            }}>Comenzar</button>

            </>):(<>

              <button onClick={()=>{reset();router.back()}}>Volver</button>
              <button onClick={()=>{setReplay(true)}}>Nuevo Juego</button>
            </>)}
          </div>       

          ):(
            <p>no deberías ver esto</p>
          )}
             
        </Popup>
        </>
      
     
      
    )}
    </>
  );
}