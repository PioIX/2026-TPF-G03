"use client"
import Button from '@/components/Button';
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"

export default function CredencialesPage() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(0)
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const router = useRouter();

  useEffect(() => {
    fetch.getUsuarios()
      .then((data) => {
        setArrayUsuarios(data)
      })
  }, [])

  function handleSignup() {
    if (usuario == "" || arrayUsuarios.some(usu => usu.username == usuario) == true) {
      return ("Dato no valido")
    } else {
      if (contrasena == "") {
        return ("Dato no valido")
      } else {
        let nuevoUsuario = {
          username: usuario,
          password: contrasena,
          points: 10,
          is_admin: 0
        }
        useFetch.postUsuario(nuevoUsuario)
        setUsuarioLogueado(useFetch.getUsuarioPorUsername(usuario)[0].id)
        useFetch.postEstadistica(usuarioLogueado)
        /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
        router.replace("/Home/page.js");
      }
    }
  }

  function handleLogin() {
    for (i = 0; i < arrayUsuarios.length; i++)
      if (arrayUsuarios[i].username == usuario) {
        if (arrayUsuarios[i].password == contrasena) {
          setUsuarioLogueado(arrayUsuarios[i].id)
          /*sessionStorage.setItem("User", JSON.stringify(usuarioLogueado))*/ //ver si hacemos con cookies o que
          if (usuarioLogueado.is_admin == true) {
          router.replace("/Admin/page.js");
          }
          router.replace("/Home/page.js");
        } else {
          return ("Datos no validos")
        }
      } else {
        return ("Datos no validos")
      }
  }

  return (
    <>
      <h1>Login y registro</h1>
      <p>llene los campos y presione el boton correspondiente a su solicitud</p>
      <input id='' placeholder='Ingrese el nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input>
      <input id='' placeholder='Ingrese la contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}}></input>
      <Button id='' onClick={handleLogin}>Loguearse</Button>
      <Button id='' onClick={handleSignup}>Registrarse</Button>
    </>
  )
}