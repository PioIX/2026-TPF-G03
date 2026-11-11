"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';
import styles from "./page.module.css";
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const popupProps = {
contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
overlayStyle: { background: "rgba(0,0,0,0.65)" },
};
export default function LoginPage() {

  const [logged,setLogged]=useState(false)
  const [disabled,setDisabled]=useState(false)
  const [process,setProcess]=useState("")
const [admin, setAdmin] = useState(false)




  const [loading,setLoading]=useState(true)
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [logOpen, setLogOpen] = useState(false)
  const [regOpen, setRegOpen] = useState(false)
  const router = useRouter();


 

  useEffect(() => {
    setErrorMessage("")
    let t=localStorage.getItem("userid")
    console.log(t)
    if(t==-1){
      setAdmin(true)
    }else{
      if (Number(t)){
        setLogged(true)
      }else{
      useFetch.getUsuarios()
        .then((data) => {
          setArrayUsuarios(data)
        })
      }
    }
  }, [])
  
    useEffect(()=>{
    if(logged){
      let t=localStorage.getItem("userid")
      console.log(t)
      if(t==-1){
        setAdmin(true)
      }else{
        //check de items que tiene equipados
        useFetch.getEquipados(t)
        .then((data)=>{
          data.map((it,i)=>{
            useFetch.getItemPorId(it.itemid)
            .then((item)=>{
              if (item[0].name.includes("Fondo")){
                localStorage.setItem("Fondo",JSON.stringify(item[0]))
              }else if(item[0].name.includes("Pipi")){
                localStorage.setItem("Pipi",JSON.stringify(item[0]))
  
              }//equipar item que creo que no se va a usar
              if(i==data.length-1){
                router.replace("./Home")
              }
            })
          })
        })
      }
    }
  },[logged])
  
  useEffect(()=>{
    if(admin){
      router.replace("./Admin")
    }
  },[admin])
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
          useFetch.postUsuario(nuevoUsuario)
          .then((data)=>{
             localStorage.setItem("userid",data)
          //fetch de post devuelve el id del dato insertado
              useFetch.postEstadistica(data)
            .then((data)=>{
              setProcess("")
              setDisabled(false)
              setLogged(true)
              })
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
              if (arrayUsuarios[i].is_admin == true) {
                t=arrayUsuarios[i].id
                router.replace("./Admin")
              } else {
                t=arrayUsuarios[i].id
                localStorage.setItem("userid",t)
                setProcess("")
                setDisabled(false)
                setLogged(true)
              }
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
    <div className={clsx(styles.page, pixel.className)}>

    {(loading)?(
      <h1 className={styles.loading}>Cargando..</h1>
  
    ):(
    <>
     <div className={styles.titleWrap}>
          <h1 className={styles.title}> Blackjack </h1>
        </div>
        <section className={styles.menu}>

{disabled?(<>
 <button className={styles.btn} disabled>Iniciar sesión</button>
<button  className={styles.btn} disabled>Registrarse</button>

</>):(<>
<button  className={styles.btn} onClick={()=>{setLogOpen(true)}}>Iniciar sesión</button>
<button className={styles.btn} onClick={()=>{setRegOpen(true)}}>Registrarse</button>
</>)}
  </section>
      <Popup open={logOpen} onClose={() => { setLogOpen(false);setErrorMessage("");setUsuario("");setContrasena("") }} closeOnDocumentClick={false}  {...popupProps}>
        {arrayUsuarios &&
          <>
           <div className={clsx(styles.popupBox, pixel.className)}>
                        <h1>Ingrese sus datos</h1>

            <input className={styles.input} placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input><br></br>
            <input className={styles.input} placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}} type="password"></input><br></br>
           
           
              <p className={styles.popupText}>{errorMessage}</p>
            <div className={styles.popupActions}>
            {(disabled)?(
               <button className={styles.btn} disabled>Confirmar</button>
            ):(
              <button className={styles.btn} onClick={()=>{setProcess("login");setDisabled(true);}}>Confirmar</button>
            )}
            
            <button className={styles.btn} onClick={() => { setLogOpen(false);setDisabled(false);setProcess("")}}>Cerrar</button>
            </div>
            
            </div>
          </>
        }
      </Popup>
      <Popup open={regOpen} onClose={() => { setRegOpen(false);setErrorMessage("");setUsuario("");setContrasena("") }} closeOnDocumentClick={false}  {...popupProps}>
        {arrayUsuarios &&
          <>
           <div className={clsx(styles.popupBox, pixel.className)}>
            <h1>Ingrese sus datos</h1>
            <input className={styles.input} placeholder='Nombre de usuario' value={usuario} onChange={(event)=>{setUsuario(event.target.value)}}></input><br></br>
            <input className={styles.input} placeholder='Contraseña' value={contrasena} onChange={(event)=>{setContrasena(event.target.value)}} type="password"></input><br></br>
              <p className={styles.popupText}>{errorMessage}</p>
           
            <div className={styles.popupActions}>
            {(disabled)?(
               <button disabled className={styles.btn}>Confirmar</button>
            ):(
              <button className={styles.btn} onClick={()=>{setProcess("login");setDisabled(true)}}>Confirmar</button>
            )}
            <button className={styles.btn} onClick={() => { setRegOpen(false);setDisabled(false);setProcess("");}}>Cerrar</button>
            </div>
            </div>
          </>
        }
      </Popup>
      
         
    </>
  )}
     </div>
  )
}