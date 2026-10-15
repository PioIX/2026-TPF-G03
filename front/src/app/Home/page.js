"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [estadistica,setEstadistica]=useState({})
  // id de usuario de prueba, se debe obtener con algún storage
  const usuarioId = 1 /*(usuarioLogueado lo importamos de login)*/
  const [usuario,setUsuario]=useState({})
  const [loading,setLoading]=useState(true)
  const router = useRouter()

  useEffect(()=>{
    useFetch.getUsuarioPorId(usuarioId)
    .then((data)=>{
      setUsuario(data.message)
    })
  },[])

  useEffect(()=>{
    if(usuario && Object.keys(usuario).length!=0){
      setLoading(false)
    }
  },[usuario])

  
  useEffect(()=>{

  },[])

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
      <div>
        <header>
          <Button id={btnlogout} onClick={logout()}>
          </Button>
          <Button id={btnprofile} onClick={showstats()}>
          </Button>
        </header>
        <div id={title}>
          <h1 id={titleh1}> Blackjack </h1>
        </div>
        <section id={buttons}>
          <div id={btnjugar}>
            <Button id={iniciar} onClick={handleirs()}><span className={decoration}></span> Jugar <span className={decoration}></span> </Button>
            /* el que ya habia*/ <button onClick={()=>{router.push("./JuegoSP")}}>Ir al juego</button>
          </div>
          <div id={tr}>
            <Button onClick={()=>{router.push("/Tienda")}}>
              Tienda
            </Button>
            <Button onClick={()=>{router.push("/Ranking")}}>
              Ranking
            </Button>
          </div>
        </section>
        <p id={homeaviso}></p>
        <div id={divdialog}>
          <dialog id={dialogpoints}>
            <h2 id={ppoints}><span className={decoration}></span> Seleccione cuantos puntos quiere apostar<span className={decoration}></span></h2>
            <div id={pi}>
              <p> Tus puntos: <span id={showuserpoints}></span></p>
              <input type="number" id={inputpoints}></input>
            </div>

            <Button id={confirmpoints} className={btndialog} >Enviar</Button>
          </dialog>
        </div>
        <dialog id={dialoguser}>
          <h2>Usuario: <span id={h2user}></span> </h2>
          <div id={stats}>
            <div className={pdiv}><p><span className={decoration}></span>Puntos: </p> <span id={statpoints}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Partidas ganadas: </p> <span id={statwins}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Partidas perdidas: </p> <span id={statlosses}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Partidas jugadas: </p> <span id={statplayed}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Puntos perdidos: </p> <span id={statlostpoints}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Racha: </p><span id={statstreak}></span></div>
            <div className={pdiv}><p><span className={decoration}></span>Cantidad de items: </p><span id={statitems}></span></div>
          </div>
          <Button id={statreturn} class={btndialog} onclick={()=>{router.refresh()}}>Volver</Button>
        </dialog>
      </div>
    </>
  );
}