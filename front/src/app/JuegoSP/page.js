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
  const usuarioId=1
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)


  useEffect(()=>{
        useFetch.getUsuarioPorId(usuarioId)
        .then((data)=>{
          setUsuario(data.message)
        })
      },[])

      useEffect(()=>{
        setLoading(false)
      },[usuario])

  return (
    <>
    {(loading)?(
      <p>Cargando...</p>
    ):(
      <>
      <header><button onClick={router.back()}>Volver</button></header>
      <body>
        <section>
          {/*Poner p con información de puntos de cada uno y pngs de las cartas*/}
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={usercards}></ArrCartas>
          <ArrCartas cards={dealcards}></ArrCartas>

        </section>
        <section>

        </section>
      </body>
      </>
    )}
    </>
  );
}