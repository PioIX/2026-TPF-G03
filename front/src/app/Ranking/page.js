"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from "./page.module.css";
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export default function RankingPage() {
  const [datos,setDatos]=useState([])
  const [loading,setLoading]=useState(true)
  const router = useRouter()

  const [pipi,setPipi]=useState(null)
  const [item,setItem]=useState(null)
  const [fondo,setFondo]=useState(null)

  useEffect(()=>{
      useFetch.getRanking()
      .then((data)=>{
        if(localStorage.getItem("Fondo")){
        setFondo(JSON.parse(localStorage.getItem("Fondo")))
        }
        if(localStorage.getItem("Pipi")){
          setPipi(JSON.parse(localStorage.getItem("Pipi")))
        }
        if(localStorage.getItem("Misc")){
          setItem(JSON.parse(localStorage.getItem("Misc")))
        }
        setDatos(data)
      })
    },[])

    useEffect(()=>{
      if(datos && datos.length!=0){
        setLoading(false)
      }
    },[datos])
  return (
    <>
    <div className={clsx(styles.page, pixel.className)} style={{backgroundImage: fondo ? `url(${fondo.imgsrc})` :null,backgroundColor: !fondo ?  "#2a2a2a":null}}>
    {(loading)?(
      <h1 className={styles.loading}>Cargando ranking..</h1>
    ):(
      <>
      <div className={styles.rmain}>
      <h1 className={styles.title}>Ranking</h1>
      <div className={styles.ranking}>
      <table>
        <thead>
          <tr>
        <th>Posición</th>
        <th>Username</th>
        <th>Puntaje</th>
        <th>ID</th>
        </tr>
      </thead>
      <tbody>
        {datos.map((d,i)=>(
            <tr key={i}>
              <td>{i+1}</td>
              <td>{d.username}</td>
              <td>{d.points}</td>
              <td>{d.id}</td>
            </tr>
        ))}
      </tbody>
      </table>
      </div>
      <button onClick={()=>{router.back()}} className={styles.btn}>Volver</button>
      </div>
      </>
    )}
    </div>
    
    </>
  );
}