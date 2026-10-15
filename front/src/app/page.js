"use client"
import Button from '@/components/Button';

import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

const [usuarioLogueado, setUsuarioLogueado] = useState(0)
const [arrayUsuarios, setArrayUsuarios] = useState([])
const [usuario, setUsuario] = useState("")
const [contrasena, setContrasena] =useState("")
const router = useRouter();

useEffect(() => {
  fetch.getUsuarios()
    .then((data) => {
      setArrayUsuarios(data)
    })
}, [])

export default function HomePage() {
  function handleSignup() {
    let usuario = prompt("Ingrese su nombre de usuario deseado..."); /*input html*/
    if (usuario == "" || arrayUsuarios.some(usu => arrayUsuarios.username == usuario) == true) {
      return ("Dato no valido")
    } else {
      let contrasena = prompt("Ingrese su contraseña deseada...") /*input html*/
      if (contrasena == "") {
        return ("Dato no valido")
      } else {
        let nuevoUsuario = {
          username: usuario,
          password: contrasena,
          points: 10,
          is_admin: 0
        }
        postUsuario(nuevoUsuario)
        setUsuarioLogueado(getUsuarioporUsername(usuario)[0].id)
        postEstadistica(usuarioLogueado)
        sessionStorage.setItem("User", JSON.stringify(usuarioLogueado)) //ver si hacemos con cookies o que
        // window.location.reload() /*este se hace automatico con un conditional render que saque login y registro*/
      }
    }
  }

  function handleLogin() {
    let usuario = prompt("Ingrese su nombre de usuario...") /*input html*/
    let contrasena = prompt("Ingrese la contraseña del usuario...") /*INPUT HTML*/
    for (i = 0; i < arrayUsuarios.length; i++)
      if (arrayUsuarios[i].username == usuario) {
        if (arrayUsuarios[i].password == contrasena) {
          setUsuarioLogueado(arrayUsuarios[i].id)
          sessionStorage.setItem("User", JSON.stringify(UserLogged))
          if (usuarioLogueado.is_admin == true) {
            // window.location.href = 'admin.html' /*router a la pagina de admin*/
          }
          // window.location.reload() /*este se hace automatico con un conditional render que saque login y registro*/
        } else {
          return ("Datos no validos")
        }
      } else {
        return ("Datos no validos")
      }
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
        {usuarioLogueado == 0 ? (
          /* todo esto lo metemos en la pagina y lo desaparecemos con un conditional que no sea de todo el html*/
          <div>
              <h1>Login y registro</h1>
              <p>llene los campos y presione el boton correspondiente a su solicitud</p>
              <input id='' placeholder='Ingrese el nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input>
              <input id='' placeholder='Ingrese la contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}}></input>
              <Button id='' onClick={handleLogin}>Loguearse</Button>
              <Button id='' onClick={handleSignup}>Registrarse</Button>
          </div>
           /* popups para esto */
        ) : (
          <div>
            <header>
              <Button id={btnlogout} onClick={logout}>

              </Button>
              <Button id={btnprofile} onClick={showstats()}>


              </Button>
            </header>
            <div id={title}>
              <h1 id={titleh1}> Blackjack </h1>
            </div>
            <section id={buttons}>
              <Button onClick={handleSignup()}>
                Registro
              </Button>
              <Button onClick={handleLogin()}> Login

              </Button>
              <div id={btnjugar}>
                <Button id={iniciar} onClick={handleirs()}><span className={decoration}></span> Jugar <span className={decoration}></span> </Button>
                /* el que ya habia*/ <button onClick={()=>{router.push("./JuegoSP")}}>Ir al juego</button>
              </div>
              <div id={tr}>
                <Button onClick={handleTienda()}>
                  Tienda
                </Button>
                <Button onClick={socketpocketlalala}  /*window.location.href='ranking.html*/>
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
              <Button id={statreturn} class={btndialog} onclick="window.location.reload()" /*porfa router*/ >Volver</Button>
            </dialog>
          </div>
        )}
      </div>
    </>
  );
}