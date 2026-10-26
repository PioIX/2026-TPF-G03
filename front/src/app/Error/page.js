"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter, useSearchParams } from "next/navigation"
import Popup from 'reactjs-popup';


export default function ErrorPage() {
  const [open,setOpen]=useState(false)
  const [eMsg,setEMsg]=useState(true)
  const router = useRouter()
  const searchParams=useSearchParams()

  useEffect(()=>{
    let err=searchParams.get("err")
    if(err==1){
        setEMsg("Host desconectado")
    }else if(err==2){
         setEMsg("Sala no existe")
    }
    },[])

    useEffect(()=>{
      if(eMsg){
        setOpen(true)
      }
    },[eMsg])
  return (
    <>
    
      <>
          <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={false}>
                      <>
                        <h1>{eMsg}</h1>
                      <button onClick={()=>{setOpen(false);router.replace("/Home")}}>Home</button>
                      </>   
               </Popup>
      </>
    </>
  );
}