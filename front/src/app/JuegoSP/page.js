"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import {useBlackJackLogic} from "@/hooks/useBlackjack"
import ArrCartas from "@/components/ArrCartas";
import Popup from 'reactjs-popup';
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./page.module.css";
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};

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

  const [T,setT]=useState("")
  const [popupText,setPopupText]=useState("")
  const [puntosA,setPuntosA]=useState(0)

  const [pipi,setPipi]=useState(null)
  const [item,setItem]=useState(null)
  const [fondo,setFondo]=useState(null)
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
        console.log("dealer")
        console.log(dealsum)
        console.log("user")
        console.log(usersum)
        console.log("Wl -1")
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
        console.log("condiciones cumplidas")
        let res=givedealcard()
        console.log(res)
      } else if(dealsum>usersum && dealsum<=21){
        setWL(-1)
      }
      
    }, 1500);
    return () => clearTimeout(timer);
  }



  function win(points){
   console.log("win running")
    if(pipi){
      if(pipi.name=="Pipi"){
        //Pipi normal, no hace nada creo
      }else if(pipi.name=="Evil Pipi"){
        let c = Math.floor(Math.random() * (4 - 1 + 1) + 1)
        if(c==1){
          points=points*3
          setT("Pipi vomitó! Puntos triplicados")
        }else{
          let r= Math.floor(Math.random() * (5 - 2)+2)
          console.log(r)
          points-=r
          setT(`Pipi se comió ${r} punto/s`)
        }

      }else if(pipi.name=="Pipi loco"){
       let r= Math.floor(Math.random() * (10 - -6) + -6)
       console.log(r)
       points+=r
       if(r>=0){
         setT(`Pipi sumó ${r} puntos`)
       }else{
        setT(`Pipi restó ${r*-1} puntos`)
       }

      }else if(pipi.name=="Pipi responsable"){
        points=Math.round(points*1.25)
        setT("Pipi multiplicó por 1.25")

      }else if(pipi.name=="Pipi clasista"){
        if(usuario.points>50){
          points=Math.round(points*1.5)
          setT("Pipi multiplicó por 1.5")
        }else{
          setT("Sos muy pobre, pipi no hizo nada")
        }
      }
    }
    console.log(usuario)
    setPopupText("Ganaste")
    console.log(points)
    let newE={
      userid:usuario.id,
      wins:estadistica.wins+1,
      losses:estadistica.losses,
      played:estadistica.played+1,
      streak:estadistica.streak+1,
      points_lost:estadistica.points_lost,
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points+parseInt(points),usuario.id)
    usuario.points+=parseInt(points)
  }

  function lose(points){
    console.log("lose running")
    setPopupText("Perdiste")
    console.log(usuario)
    let newE={
      userid:usuario.id,
      wins:estadistica.wins,
      losses:estadistica.losses+1,
      played:estadistica.played+1,
      streak:0,
      points_lost:estadistica.points_lost+parseInt(points),
      cant_items:estadistica.cant_items
    }
    useFetch.putEstadistica(newE)
    useFetch.putPoints(usuario.points-parseInt(points),usuario.id)
    usuario.points-=parseInt(points)

  }



  return (
    <>
    <div className={clsx(styles.page, pixel.className)} style={{backgroundImage: fondo ? `url(${fondo.imgsrc})` :null,backgroundColor: !fondo ?  "#2a2a2a":null}}>
    {(loading)?(
      <>
      <header className={styles.header}><button className={clsx(styles.btn, styles.small)} disabled>Volver</button></header>
       
        <section className={styles.mesa}>
          <h2>Cargando cartas...</h2>
        </section>

        <section className={styles.menu}>
      <button className={styles.btn} disabled>Hit</button>
      <button className={styles.btn} disabled>Stand</button>
        </section>
     
      </>
    ):(
      <>
      <header className={styles.header}><button className={clsx(styles.btn, styles.small)} onClick={()=>{reset();router.back()}}>Volver</button></header>
        <section className={styles.mesa}>
          <div>
            <p>Dealer: {dealsum}</p>
            <p>Vos: {usersum}</p>
          </div>
          <ArrCartas cards={dealcards}></ArrCartas>
          <ArrCartas cards={usercards}></ArrCartas>
        </section>
        <section className={styles.menu}>
          {(disabled)?(<>
          <button className={styles.btn} disabled>Hit</button>
          <button className={styles.btn} disabled>Stand</button>
          </>):(<>
          <button className={styles.btn} onClick={()=>{hit()}}>Hit</button>
          <button className={styles.btn} onClick={()=>{stand()}}>Stand</button>
          </>)}
        </section>
        <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={false} closeOnEscape={false} {...popupProps}>
          {(usuario)?(
            <div className={clsx(styles.popupBox, pixel.className)}>
            <h2 className={styles.popupTitle}>{popupText}</h2>
            {T&&
            <p className={styles.popupText}>{T}</p>
            }
            <ul>
              <li>Dealer: {dealsum}</li>
              <li>Vos: {usersum}</li>
              <li>Tu dinero: {usuario.points}</li>
            </ul>
            {(replay)?(<>
            <p className={styles.popupText}>¿Cuántos puntos quiere apostar?</p>
              <input className={styles.input} onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
              {valueError&&<p className={styles.error}>Valor inválido</p>}
            <button className={styles.btn} onClick={()=>{
              if((puntosA>0 && puntosA<=usuario.points) || puntosA==1){
                setOpen(false);
                setValueError(false)
                setReplay(false)
                setPopupText("")
                setT("")
                sessionStorage.setItem("puntosApostados",puntosA)
                reset()
                setLoading(true)

              }else{
                setValueError(true)
              }
            }}>Comenzar</button>

            </>):(<>

              <button className={styles.btn} onClick={()=>{reset();router.back()}}>Volver</button>
              <button className={styles.btn} onClick={()=>{setReplay(true)}}>Nuevo Juego</button>
            </>)}
          </div>       

          ):(
            <p>no deberías ver esto</p>
          )}
             
        </Popup>
        </>
      
     
      
    )}
    </div>
    </>
  );
}