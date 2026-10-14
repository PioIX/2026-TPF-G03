"use client"
import Button from '@/components/Button';

import { useEffect, useState } from "react";
import * as fetch from "@/hooks/fetch.js"
import { useRouter } from "next/navigation"

const [usuarioLogueado, setUsuarioLogueado] = useState(0)
const [arrayUsuarios, setArrayUsuarios] = useState([])


  useEffect(()=>{
    fetch.getUsuarios()
    .then((data)=>{
      setArrayUsuarios(data)
    })
  }, [])

export default function HomePage() {

  function handleSignup(){
    let respuestaUsername = prompt("Ingrese su nombre de usuario deseado..."); /*input html*/
      if (arrayUsuarios.some(usu => arrayUsuarios.username==respuestaUsername) == true){
        return("Dato en uso")
      }else{
        
      }
    let respuestaPassword = prompt("Ingrese su contraseña deseada...") /*input html*/
    if (!respuestaPassword){
        respuestaPassword = prompt("Valor vacio. Completelo...") 
    }

    let nuevoUsuario={
        username: respuestaUsername,
        password: respuestaPassword,
        points: 10,
        is_admin: 0
    }
    
    alert(postUsuario(newUsuario)) /*post del dato, cambiar*/
    createduser = getUsuarioporUsername(respuestaUsername) /*adaptar a state*/
    postEstadistica(createduser.id) /*post de la estadistica, cambiar*/
    sessionStorage.setItem("User",JSON.stringify(UserLogged))
    window.location.reload() /* este y el de arriba con router y un conditional render que saque login y registro*/

}

// async function handleLogin(){
//     let respuestaUsername = prompt("Ingrese su nombre de usuario...")
//     let leerUsername = await getUsuarioporUsername(respuestaUsername)
//         if (!leerUsername || Object.keys(leerUsername).length===0){
//             coincidencia=false
//         }else{
//             coincidencia=true
//         }
//     if (coincidencia == true) {
//         let respuestaPassword = prompt("Ingrese la contraseña del usuario...")
//         while (leerUsername.password !== respuestaPassword){
//             respuestaPassword = prompt("La contraseña no es correcta. Vuelva a intentar...")
//         }
//         alert("Login exitoso!")
//         UserLogged = new Usuario(leerUsername.id)
//         await UserLogged.updateuser()
//         sessionStorage.setItem("User",JSON.stringify(UserLogged))
//         tryAdmin()
//         window.location.reload()
//     } else {
//         alert("Usuario no encontrado. Vuelva a intentarlo.")
//     }
// }

// function tryAdmin() {
//     if (UserLogged.is_admin == true) {
//         window.location.href = 'admin.html'
//     } else if (UserLogged.is_admin == false) {
//         alert("Este usuario no cuenta con privilegios de administracion.")
//     } else {
//         alert("No hay usuario logueado.")
//     }
// }


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
// /*nota: borrar usuario vacio que tiene nombre ""*/







  return (
    <>
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
          <Button id={iniciar} onClick={handleirs()}><span className='decoration'></span> Jugar <span className='decoration'></span> </Button>
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
          <div className={pdiv}><p><span className={decoration}></span>Puntos: </p> <span  id={statpoints}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Partidas ganadas: </p> <span  id={statwins}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Partidas perdidas: </p> <span  id={statlosses}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Partidas jugadas: </p> <span  id={statplayed}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Puntos perdidos: </p> <span  id={statlostpoints}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Racha: </p><span  id={statstreak}></span></div>
          <div className={pdiv}><p><span className={decoration}></span>Cantidad de items: </p><span  id={statitems}></span></div>
        </div>
        <Button id={statreturn} class={btndialog} onclick="window.location.reload()" /*porfa router*/ >Volver</Button>
      </dialog>
    </>
  );
}