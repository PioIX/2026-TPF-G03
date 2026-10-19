"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function LoginPage() {
 const [logged,setLogged]=useState(false)
const [disabled,setDisabled]=useState(false)

 const [loading,setLoading]=useState(true)
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
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

  function handleSignup() {
    setDisabled(true)
    console.log("signup REACHED")
    if (usuario == ""  || contrasena == "") {
      setErrorMessage("Rellene todos los campos.")
      setDisabled(false)

    }else{
      if(/\W/.test(usuario) ||/[^a-zA-Z0-9_]/.test(contrasena)){
      setErrorMessage("Alguno de los datos no es válido. Revise si utilizó caracteres especiales o espacios.")
      setDisabled(false)

      }else{
        if (arrayUsuarios.some(usu => usu.username == usuario) == true ) {
        setErrorMessage("Nombre de usuario repetido")
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
    setDisabled(true)
     if (usuario == ""  || contrasena == "") {
      setErrorMessage("Rellene todos los campos.")
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
              setDisabled(false)
              setLogged(true)
  
            }
          }
      }
      if(!t){
        setErrorMessage("Usuario o contraseña incorrecta")
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
      <p>Llene los campos para registrarse o iniciar sesión</p>
      <input placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input>
      <input placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}} type="password"></input>
      <p>{errorMessage}</p>
      {disabled?(<>
       <button onClick={handleLogin}>Iniciar sesión</button>
      <button onClick={handleSignup}>Registrarse</button>
  
      </>):(<>
      <button onClick={handleLogin}>Iniciar sesión</button>
      <button onClick={handleSignup}>Registrarse</button>
      </>)}
         
    </>
  )}
     
    </>
  )
}