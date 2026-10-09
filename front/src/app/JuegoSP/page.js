"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
// ejemplo de uso del hook
import {useBlackJackLogic} from "@/hooks/useBlackjack"
import ArrCartas from "../Components/ArrCartas";

export default function JuegoSPPage() {
  const {usersum,dealsum,isuserturn,usercards,dealcards,reset,givedealcard,giveusercard,dealerTurn,userTurn} = useBlackJackLogic()
  const router=useRouter()
  const [usuario,setUsuario]=useState({})
  const [estadistica,setEstadistica]=useState({})

  const [loading,setLoading]=useState(true)
  const [disabled,setDisabled]=useState(true)


  //valores temporarios, se deben importar o poner en storage
  const usuarioId=1
  const puntosApostados=1

  useEffect(()=>{

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
    if (Object.keys(usuario).length!=0 && Object.keys(estadistica).length!=0){
      givedealcard()
      giveusercard()
      setLoading(false)
      setDisabled(false)
    }
      
  },[estadistica,usuario])



  function hit(){
    res = userTurn()
    console.log(res)
    if(res==1){
      console.log("win")
      setDisabled(true)
      if(usersum==21){
        win(puntosApostados*3)
      }else{
        win(puntosApostados)
      }

    }else if(res==-1){
      console.log("l")
      setDisabled(true)
      lose(puntosApostados)
    }
  }

  function stand(){
    let turn =true
    while(turn){
      //timeout
      let res=dealerTurn()
      console.log(res)
      if(res==1){
        console.log("win")
        turn=false
        win(puntosApostados)

      }else if(res==-1){
        console.log("l")
        turn=false
        lose(puntosApostados)
      }
    }
  }


  function win(points){
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
    //mostrar popup win
  }

  function lose(points){
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
    //mostrar popup lose

  }



  return (
    <>
    {(loading)?(
      <>
      <header><button disabled>Volver</button></header>
        <body>
        <section>
          <h2>Cargando cartas...</h2>
        </section>

        <section>
      <button disabled>Hit</button>
      <button disabled>Stand</button>
        </section>
      </body>
      </>
    ):(
      <>
      {(disabled)?(
        <>

        <header><button onClick={router.back()}>Volver</button></header>
        <body>
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
      </body>
      </>
      ):(
        <>
        <header><button onClick={router.back()}>Volver</button></header>
        <body>
        <section>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={usercards}></ArrCartas>
          <ArrCartas cards={dealcards}></ArrCartas>
        </section>

        <section>
      <button onClick={hit()}>Hit</button>
      <button onClick={stand()}>Stand</button>
        </section>
      </body>
        {/*popups win, lose, replay con input */}
        
        </>
      )}
      </>
      
    )}
    </>
  );
}