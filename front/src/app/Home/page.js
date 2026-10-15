"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';

export default function HomePage() {
  let usuarioId = 0
  const router=useRouter()
  const [estadistica,setEstadistica]=useState({})
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)
  const [Popen,setPopen]=useState(false)
  const [Eopen,setEopen]=useState(false)
  const [valueError,setValueError]=useState(false)
  const [puntosA,setPuntosA]=useState(1)

  let usuarioId = 0 /*(usuarioLogueado lo importamos de login)*/
  const router = useRouter()

  useEffect(()=>{
    usuarioId=localStorage.getItem("userid")
    console.log(usuarioId)
    useFetch.getUsuarioPorId(usuarioId)
    .then((data)=>{
      setUsuario(data[0])
    })
  },[])

  useEffect(()=>{
    if(usuario && Object.keys(usuario).length!=0){
      setLoading(false)
    }
  },[usuario])


  function cargarEst(){
    setEstadistica(()=>{
      useFetch.getEstadisticaDeUsuario(usuarioId)
      .then((data)=>{
        console.log(data)
        return data.message
      })
    }
    )
  }

  /*hacer cuando decidamos que usamos para guardar sesion*/
  // async function logout() {
  //     let tempuser=JSON.parse(sessionStorage.getItem("User"))
  //     if (tempuser==null){
  //         alert("No hay usuario iniciado")
  //     }else if(confirm("¿Está seguro de que quiere cerrar sesión?")){
  //         sessionStorage.setItem("User",null)
  //         UserLogged = {}
  //         alert("Sesión cerrada")
  //         window.location.reload()
  //     }
  // }

  return (
    <>
    {(loading)?(<>
    <h1>Cargando...</h1>
    </>):(<>
      <Popup open={Popen} onClose={()=>{setPopen(false)}} closeOnDocumentClick={false}>
        {(usuario)?(
          <div>
            <h2>¿Cuántos puntos quiere apostar?</h2>
            <input onChange={(e)=>{setPuntosA(e.target.value)}} value={puntosA}></input>
            {valueError&&<p>Valor inválido</p>}
            <button onClick={()=>{
              if((puntosA>0 && puntosA<=usuario.points) || puntosA==1){
                setPopen(false);
                setValueError(false)
                sessionStorage.setItem("puntosApostados",puntosA)
                router.push("./JuegoSP")
              }else{
                setValueError(true)
              }}}>Comenzar</button>
                </div>       
                ):(
                  <p>no deberías ver esto</p>
                )}
              </Popup>
    
    </>)}
      
      <div>
        <header>
          <Button onClick={logout()}>
          </Button>
          <Button onClick={showstats()}>
          </Button>
        </header>
        <div>
          <h1> Blackjack </h1>
        </div>
        <section id={buttons}>
            <Button onClick={()=>{router.push("/Tienda")}}>
              Tienda
            </Button>
    <button onClick={()=>{setPopen(true)}}>Ir al juego</button>
            <Button onClick={()=>{router.push("/Ranking")}}>
              Ranking
            </Button>
          </div>
        </section>
        //popup con estadística de usuario
      </div>
    </>
  );
}