"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';

export default function LoginPage() {
 const [logged,setLogged]=useState(false)
const [disabled,setDisabled]=useState(false)
 const [process,setProcess]=useState("")

 const [loading,setLoading]=useState(true)
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [logOpen, setLogOpen] = useState(false)
  const [regOpen, setRegOpen] = useState(false)
  const router = useRouter();


 

  useEffect(() => {
    let t=localStorage.getItem("userid")
    console.log(t)
    if (Number(t)){
      setLogged(true)
    }else{
    useFetch.getUsuarios()
      .then((data) => {
        setArrayUsuarios(data)
      })
    }
  }, [])
  
    useEffect(()=>{
    if(logged){
      router.replace("./Home")
    }
  },[logged])
  
  
   useEffect(()=>{
    if(loading && arrayUsuarios.length!=0){
      setLoading(false)
    }
  },[loading,arrayUsuarios])

    useEffect(()=>{
    if(disabled){
      if(process=="login"){
        handleLogin()
      }else if(process=="registro"){
        handleSignup()
      }
    }
  },[process,disabled])

  function handleSignup() {
    console.log("signup REACHED")
    if (usuario == ""  || contrasena == "") {
      setErrorMessage("Rellene todos los campos.")
      setProcess("")
      setDisabled(false)

    }else{
      if(/\W/.test(usuario) ||/[^a-zA-Z0-9_]/.test(contrasena)){
      setErrorMessage("Alguno de los datos no es válido. Revise si utilizó caracteres especiales o espacios.")
      setProcess("")
      setDisabled(false)


      }else{
        if (arrayUsuarios.some(usu => usu.username == usuario) == true ) {
        setErrorMessage("Nombre de usuario repetido")
        setProcess("")
        setDisabled(false)
        } else {
          let nuevoUsuario = {
            username: usuario,
            password: contrasena,
            points: 10,
            is_admin: 0
          }
          console.log(nuevoUsuario)
          useFetch.postUsuario(nuevoUsuario)
          .then((data)=>{
             localStorage.setItem("userid",data)
             console.log(data)
          //fetch de post devuelve el id del dato insertado
              useFetch.postEstadistica(data)
            .then((data)=>{
              setProcess("")
              setDisabled(false)
              setLogged(true)
              })
          /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
          })
        }

      }
    }
  }

  function handleLogin() {
     if (usuario == ""  || contrasena == "") {
      setErrorMessage("Rellene todos los campos.")
      setProcess("")
      setDisabled(false)

    }else{
      let t=0
      for (let i = 0; i < arrayUsuarios.length; i++){
        if (arrayUsuarios[i].username == usuario) {
            if (arrayUsuarios[i].password == contrasena) {
              t=arrayUsuarios[i].id
              console.log(t)
              localStorage.setItem("userid",t)
               /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
               setProcess("")
              setDisabled(false)
              setLogged(true)
  
            }
          }
      }
      if(!t){
        setErrorMessage("Usuario o contraseña incorrecta")
        setProcess("")
        setDisabled(false)
  
      }

    }
       
  }



  return (
    <>
    {(loading)?(
      <h1>Cargando..</h1>
  
    ):(
    <>
     <h1>BlackJack</h1>
      <h4>Llene los campos para registrarse o iniciar sesión</h4>
      <Popup open={logOpen} onClose={() => { setLogOpen(false) }} closeOnDocumentClick={false}>
        {arrayUsuarios &&
          <>
            <input placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input><br></br>
            <input placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}} type="password"></input><br></br>
            <button onClick={handleLogin}>Confirmar</button> <button onClick={() => { setLogOpen(false);setDisabled(false);setProcess("")}}>Cerrar</button>
            <p>{errorMessage}</p>
          </>
        }
      </Popup>
      <Popup open={regOpen} onClose={() => { setRegOpen(false) }} closeOnDocumentClick={false}>
        {arrayUsuarios &&
          <>
            <input placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input><br></br>
            <input placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}} type="password"></input><br></br>
            <button onClick={handleSignup}>Confirmar</button> <button onClick={() => { setRegOpen(false);setDisabled(false);setProcess("")}}>Cerrar</button>
            <p>{errorMessage}</p>
          </>
        }
      </Popup>

      {disabled?(<>
       <button disabled>Iniciar sesión</button>
      <button disabled>Registrarse</button>
  
      </>):(<>
      <button onClick={()=>{setDisabled(true);setProcess("login");setLogOpen(true)}}>Iniciar sesión</button>
      <button onClick={()=>{setDisabled(true);setProcess("registro");setRegOpen(true)}}>Registrarse</button>
      </>)}
         
    </>
  )}
     
    </>
  )
}