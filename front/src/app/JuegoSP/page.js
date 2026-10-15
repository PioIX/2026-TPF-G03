"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import {useBlackJackLogic} from "@/hooks/useBlackjack"
import ArrCartas from "../Components/ArrCartas";
import Popup from 'reactjs-popup';


export default function JuegoSPPage() {
  const {usersum,dealsum,isuserturn,usercards,dealcards,reset,givedealcard,giveusercard,wl,setWL,setIsUserTurn} = useBlackJackLogic()
  const router=useRouter()
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})

  const [loading,setLoading]=useState(true)
  const [replay,setReplay]=useState(false)
  const [valuError,setValueError]=useState(false)

  const [disabled,setDisabled]=useState(true)
  const [open,setOpen]=useState(false)
  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)



  // FALTA: arreglar error que la ultima carta del dealer desaparece a veces idk


  //valores temporarios, se deben importar o poner en storage
  const usuarioId=1

  useEffect(()=>{
        let ptemp=sessionStorage.getItem("puntosApostados")
        console.log(wl)
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
            console.log(data[0])
            setUsuario(data[0])
          })
          .then(
            useFetch.getEstadisticaDeUsuario(usuarioId)
            .then((data=>{
              console.log(data[0])
              setEstadistica(data[0])
            }))
          )


        }
      },[loading])

  useEffect(()=>{
    if (usuario && estadistica && loading){
      if(Object.keys(usuario).length!=0&&Object.keys(estadistica).length!=0){
        console.log(usuario)
        console.log("UF")
        givedealcard()
        giveusercard()
        setLoading(false)
        setDisabled(false)
      }
      
    }
      
  },[estadistica,usuario, loading])

useEffect(()=>{
    console.log(isuserturn)
    console.log(wl)
    if (wl==1){
      console.log("win")
      setDisabled(true)
      if(usersum==21){
        win(parseInt(puntosA)*3)
      }else{
        console.log("regwin")
        win(puntosA)
      }
      }else if(wl==-1){
        setDisabled(true)
        console.log("LOSE CALL")
        lose(puntosA)
      }
      
  },[wl])

  useEffect(()=>{
    if(wl==0 && !isuserturn){
      console.log("hola")
      stand()
    }
  },[dealsum])

useEffect(()=>{
  console.log("REACHED")
  if(wl!=0){
    console.log(popupText)
    console.log(open)
    setOpen(true)
  }
  },[popupText])


  function hit(){
    let res = giveusercard()
    console.log(res)
    console.log(usercards)
  }

  function stand(){
    if(isuserturn){
      setIsUserTurn(false)
    }
    console.log(wl)
    console.log(dealsum)
    const timer = setTimeout(() => {
      if(wl==0 && dealsum<=usersum && dealsum<21){
        let res=givedealcard()
        console.log(res)
      }
      
    }, 1000);
    return () => clearTimeout(timer);
  }



  function win(points){
    console.log(dealcards)
    console.log(estadistica)
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
    useFetch.putPoints(usuario.points+parseInt(points),usuarioId)
  }

  function lose(points){
    console.log(dealcards)
    setPopupText("Perdiste")
    console.log(points)
    let newE={
      userid:usuarioId,
      wins:estadistica.wins,
      losses:estadistica.losses+1,
      played:estadistica.played+1,
      streak:0,
      points_lost:estadistica.points_lost+parseInt(points),
      cant_items:estadistica.cant_items
    }
    console.log(usuario)
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points-parseInt(points),usuarioId)

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
      <header><button onClick={()=>{router.back()}}>Volver</button></header>
        <section>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={dealcards}></ArrCartas>
          <ArrCartas cards={usercards}></ArrCartas>
        </section>

      {(disabled)?(
        <>
        <section>
      <button disabled>Hit</button>
      <button disabled>Stand</button>
        </section>
      </>
      ):(
        <>
        <section>
      <button onClick={()=>{hit()}}>Hit</button>
      <button onClick={()=>{stand()}}>Stand</button>
        </section>
         </>
        )}
        <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={false}>
          {(usuario)?(
            <div>
            <h2>{popupText}</h2>
            <ul>
              <li>Dealer: {dealsum}</li>
              <li>Vos: {usersum}</li>
              <li>Tu dinero: {usuario.points}</li>
            </ul>
            {(replay)?(<>
              <input onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
              {valuError&&<p>Valor inválido</p>}
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

              <button onClick={()=>{router.back()}}>Volver</button>
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