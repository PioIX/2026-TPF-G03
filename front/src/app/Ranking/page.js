"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function RankingPage() {
  const [datos,setDatos]=useState([])
  const [loading,setLoading]=useState(true)
  const router = useRouter()

  useEffect(()=>{
      useFetch.getRanking()
      .then((data)=>{
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
    {(loading)?(
      <h1>Cargando ranking..</h1>
    ):(
      <>
      <div style={{height: "400px",overflowY:"scroll"}}>
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
      <button onClick={()=>{router.back()}}>Volver</button>
      </>
    )}
    </>
  );
}