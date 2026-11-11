"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import Popup from 'reactjs-popup';
const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./page.module.css";
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export default function ErrorPage() {
  const [open,setOpen]=useState(false)
  const [eMsg,setEMsg]=useState(true)
  const router = useRouter()
  const searchParams=useSearchParams()
  const [pipi,setPipi]=useState(null)
  const [item,setItem]=useState(null)
  const [fondo,setFondo]=useState(null)

  useEffect(()=>{
    if(localStorage.getItem("Fondo")){
        setFondo(JSON.parse(localStorage.getItem("Fondo")))
      }
      if(localStorage.getItem("Pipi")){
        setPipi(JSON.parse(localStorage.getItem("Pipi")))
      }
      if(localStorage.getItem("Misc")){
        setItem(JSON.parse(localStorage.getItem("Misc")))
      }
    let err=searchParams.get("err")
    if(err==1){
        setEMsg("Host desconectado")
    }else if(err==2){
         setEMsg("Sala no existe")
    }else if(err==3){
         setEMsg("Sala ya existe")
    }else if(err==4){
         setEMsg("Sala no disponible")
    }else if(err==5){
         setEMsg("Puntos insuficientes para seguir jugando")
    }
    },[])

    useEffect(()=>{
      if(eMsg){
        setOpen(true)
      }
    },[eMsg])
  return (
    <>
    
      <div className={clsx(styles.page, pixel.className)} style={{backgroundImage: fondo ? `url(${fondo.imgsrc})` :null,backgroundColor: !fondo ?  "#2a2a2a":null}}>
          <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={false} {...popupProps}>
                     <div className={clsx(styles.popupBox, pixel.className)}>
                      <>
                        <h1 className={styles.popupTitle}>{eMsg}</h1>
                      <button className={styles.btn} onClick={()=>{setOpen(false);router.replace("/Home")}}>Home</button>
                      </>   
                      </div>
               </Popup>
      </div>
    </>
  );
}