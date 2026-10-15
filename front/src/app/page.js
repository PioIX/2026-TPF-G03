"use client"
import Button from '@/components/Button';
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function LoginPage() {
 const router=useRouter()
 const [logged,setLogged]=useState(true)
 const [loading,setLoading]=useState(true)
 const [userID,setUserID]=useState(1)
  const [usuarioLogueado, setUsuarioLogueado] = useState(0)
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter();

  useEffect(() => {
    t=localStorage.getItem("userid")
    if (t){
      setLogged(true)
    }else{
    fetch.getUsuarios()
      .then((data) => {
        setArrayUsuarios(data)
      })
    }
  }, [])
  
    useEffect(()=>{
    if(logged){
      router.push("./Home")
    }
  },[logged])
  
  
   useEffect(()=>{
    if(loading && arrayUsuarios.length!=0){
      setLoading(false)
    }
  },[loading])

  function handleSignup() {
    if (usuario == "" || arrayUsuarios.some(usu => usu.username == usuario) == true) {
      setErrorMessage("Dato no valido")
    } else {
      if (contrasena == "") {
      setErrorMessage("Dato no valido")
      } else {
        let nuevoUsuario = {
          username: usuario,
          password: contrasena,
          points: 10,
          is_admin: 0
        }
        useFetch.postUsuario(nuevoUsuario)
        .then((data)=>{
           localStorage.setItem("userid",data)
        //fetch de post devuelve el id del dato insertado
            useFetch.postEstadistica(data)
          .then((data)=>{
            setLogged(true)
            })
        /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
        })
      }
    }
  }

  function handleLogin() {
    let t=0
    for (i = 0; i < arrayUsuarios.length; i++){
      if (arrayUsuarios[i].username == usuario) {
          if (arrayUsuarios[i].password == contrasena) {
            t=arrayUsuarios[i].id
            localStorage.setItem("userid",t)
             /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
            setLogged(true)

          }
        }
    }
    if(!t){
      setErrorMessage("Usuario no encontrado")

    }
       
  }



  return (
    <>
    {(loading)?(
      <h1>Cargando..</h1>
  
  ):(
  <>
     <h1>Login y registro</h1>
      <p>llene los campos y presione el boton correspondiente a su solicitud</p>
      <input placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input>
      <input placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}}></input>
      <p>{errorMessage}</p>
      <Button onClick={handleLogin}>Loguearse</Button>
      <Button onClick={handleSignup}>Registrarse</Button>
    </>
  )}
     
    </>
  )
}