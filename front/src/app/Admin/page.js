"use client"

import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import Popup from 'reactjs-popup';

export default function AdminPage() {
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [arrayItems, setArrayItems] = useState([])
  const [arrayIxU, setArrayIxU] = useState([])

  const [idAdmin, setIdAdmin] = useState("")
  const [idAdminItem, setIdAdminItem] = useState("")
  const [newPuntos, setNewPuntos] = useState(0)
  const [respuestaName, setRespuestaName] = useState("")
  const [respuestaPrice, setRespuestaPrice] = useState(0)
  const [respuestaImgSrc, setRespuestaImgSrc] = useState("")

  const [XPopen, setXPopen] = useState(false)
  const [XIopen, setXIopen] = useState(false)
  const [AUopen, setAUopen] = useState(false)
  const [AUNopen, setAUNopen] = useState(false)
  const [AIUopen,setAIUopen] = useState(false)
  const [BUopen,setBUopen] = useState(false)
  const [MPopen, setMPopen] = useState(false)
  const [CIopen, setCIopen] = useState(false)
  const [BIopen,setBIopen] = useState(false)
  const [MIIopen,setMIIopen] = useState(false)
  const [MIPopen,setMIPopen] = useState(false)

  const [mensajeErrorXP, setMensajeErrorXP] = useState("")
  const [mensajeErrorXI, setMensajeErrorXI] = useState("")
  const [mensajeErrorAU, setMensajeErrorAU] = useState("")
  const [mensajeErrorAUN, setMensajeErrorAUN] = useState("")
  const [mensajeErrorAIU, setMensajeErrorAIU] = useState("")
  const [mensajeErrorBU, setMensajeErrorBU] = useState("")
  const [mensajeErrorMP, setMensajeErrorMP] = useState("")
  const [mensajeErrorCI, setMensajeErrorCI] = useState("")
  const [mensajeErrorBI, setMensajeErrorBI] = useState("")
  const [mensajeErrorMII, setMensajeErrorMII] = useState("")
  const [mensajeErrorMIP, setMensajeErrorMIP] = useState("")

  let i = 0

  useEffect(() => {
    useFetch.getUsuarios()
      .then((data) => {
        setArrayUsuarios(data)
      })
  }, [])

  useEffect(() => {
    useFetch.getItems()
      .then((data) => {
        setArrayItems(data)
      })
  }, [])

  useEffect(() => {
    useFetch.getItemsPorUsuario()
      .then((data) => {
        setArrayIxU(data)
      })
  }, [])

  async function borrarUser() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorBU("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorBU("")
      setBUopen(false)
      useFetch.deleteEstadistica(idAdmin)
      useFetch.vaciarInventario(idAdmin)
      useFetch.deleteUsuario(idAdmin)
      console.log("Usuario Borrado.")
    }
  }

  async function borrarItem() {
    let aux = await useFetch.getItemPorId(idAdminItem)
    if (idAdminItem == "" || aux[0] === undefined) {
      setMensajeErrorBI("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorBI("")
      setBIopen(false)
      useFetch.deleteItemDeTodoInventario(idAdminItem)
      useFetch.deleteItem(idAdminItem)
      console.log("Item Borrado.")
    }
  }

  async function modPuntosUser() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined || newPuntos == "") {
      setMensajeErrorMP("Complete los campos con datos validos.")
    } else {
      setMensajeErrorMP("")
      setMPopen(false)
      useFetch.putPoints(newPuntos, idAdmin)
      console.log("Puntaje modificado.")
    }
  }

  async function cheatPuntos() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorXP("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorXP("")
      setXPopen(false)
      let newPuntos = aux[0].points + 500
      useFetch.putPoints(newPuntos, idAdmin)
      console.log("Puntos añadidos.")
    }
  }

  async function adminUser() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorAU("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorAU("")
      setAUopen(false)
      useFetch.putAdmin(true, idAdmin)
      console.log("Administrador designado.")
    }
  }

  async function modItemPrice() {
    let auxItem = await useFetch.getItemPorId(idAdminItem)
    if (idAdminItem == "" || auxItem[0] === undefined || respuestaPrice == "") {
      setMensajeErrorMIP("Complete los campos con datos validos.")
    } else {
      setMensajeErrorMIP("")
      setMIPopen(false)
      useFetch.putPrice(respuestaPrice, idAdminItem)
      console.log("Precio modificado.")
    }
  }

  async function modItemImage() {
    let auxItem = await useFetch.getItemPorId(idAdminItem)
    if (arrayItems.some(ite => ite.imgsrc == respuestaImgSrc) == true || idAdminItem == "" || auxItem[0] === undefined || respuestaImgSrc == "") {
      setMensajeErrorMII("Complete los campos con datos validos.")
    } else {
      setMensajeErrorMII("")
      setMIIopen(false)
      useFetch.putItemSRC(respuestaImgSrc, idAdminItem)
      console.log("Imagen modificada.")
    }
  }


  async function creaItem() {
    if (arrayItems.some(ite => ite.name == respuestaName) == true || respuestaPrice == "" || arrayItems.some(ite => ite.imgsrc == respuestaImgSrc) == true) {
      setMensajeErrorCI("Complete los campos con datos validos.")
    } else {  
      setMensajeErrorCI("")
      setCIopen(false)
      let newItem = {
        name: respuestaName,
        imgsrc: respuestaImgSrc,
        price: respuestaPrice
      }
      useFetch.postItem(newItem)
      console.log("Creacion exitosa.")
    }
  }

  async function adminUserNon() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorAUN("Complete el campo con un ID valido.")
    } else {  
      setMensajeErrorAUN("")
      setAUNopen(false)
      useFetch.putAdmin(false, idAdmin)
      console.log("Administrador descartado.")
    }
  }

  async function addItemUser() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    let auxItem = await useFetch.getItemPorId(idAdminItem)
    if (idAdmin == "" || idAdminItem == "" || aux[0] === undefined || auxItem[0] === undefined) {
      setMensajeErrorAIU("Complete los campos con datos validos.")
    } else {
      setMensajeErrorAIU("")
      setAIUopen(false)
      let newItemUser = {
        userid: idAdmin,
        itemid: idAdminItem,
        active: 0
      }
      useFetch.postItemPorUsuario(newItemUser)
      console.log("Item añadido al usuario.")
    }
  }

  async function cheatItems() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorXI("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorXI("")
      setXIopen(false)
      let allItems = await useFetch.getItems()
      for (i=0; i < allItems.length; i++) {
        let idAllItems = allItems[i].id
        console.log(idAllItems)
        let currentItem = {
          userid: idAdmin,
          itemid: idAllItems,
          active: 0
        }
        useFetch.postItemPorUsuario(currentItem)
      }
      console.log("Todos los items añadidos al usuario.")
    }
  }

  return (
    <>
      <div>
        <h1 id="admin_h1" className="admin_h">ADMINISTRACION</h1>

        <div className="admin_div">
          <h2 className="admin_h">Usuarios </h2>

          <button onClick={() => { setBUopen(true) }}>
            Eliminar
          </button>
          <Popup open={BUopen} onClose={() => { setBUopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={borrarUser}>Confirmar</button><br></br>
                <button onClick={() => { setBUopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorBU}</p>

          <button onClick={() => { setAUopen(true) }}>
            Designar como administrador
          </button>
          <Popup open={AUopen} onClose={() => { setAUopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={adminUser}>Confirmar</button><br></br>
                <button onClick={() => { setAUopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorAU}</p>

          <button onClick={() => { setAUNopen(true) }}>
            Descartar como administrador
          </button>
          <Popup open={AUNopen} onClose={() => { setAUNopen(false) }} closeOnDocumentClick={false}>
          {arrayUsuarios &&
            <>
              <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={adminUserNon}>Confirmar</button><br></br>
              <button onClick={() => { setAUNopen(false) }}>Cerrar</button>
            </>
          }
        </Popup>
        <p>{mensajeErrorAUN}</p>

          <button onClick={() => { setMPopen(true) }}>
            Modificar puntaje
          </button>
          <Popup open={MPopen} onClose={() => { setMPopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <br></br>
                <input placeholder="¿Cuantos puntos quiere que tenga?" value={newPuntos} onChange={(event)=>{setNewPuntos(event.target.value)}}></input> <br></br>
                <button onClick={modPuntosUser}>Confirmar</button> <button onClick={() => { setMPopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorMP}</p>

          <button onClick={() => { setAIUopen(true) }}>
            Añadir items
          </button>
          <Popup open={AIUopen} onClose={() => { setAIUopen(false) }} closeOnDocumentClick={false}>
          {arrayUsuarios &&
            <>
              <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input><br></br>
              <input placeholder="¿Que ID de item desea dar al usuario?" value={idAdminItem} onChange={(event)=>{setIdAdminItem(event.target.value)}}></input><br></br>
              <button onClick={addItemUser}>Confirmar</button> <button onClick={() => { setAIUopen(false) }}>Cerrar</button>
            </>
          }
          </Popup>
          <p>{mensajeErrorAIU}</p>
        </div>

        <div className="admin_div">
          <h2 className="admin_h">Items</h2>

          <button onClick={() => { setCIopen(true) }}>
            Crear
          </button>
          <Popup open={CIopen} onClose={() => { setCIopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="Ingrese su nombre de su item" value={respuestaName} onChange={(event)=>{setRespuestaName(event.target.value)}}></input><br></br>
                <input placeholder="Ingrese el nombre de archivo de la imagen de su item." value={respuestaImgSrc} onChange={(event)=>{setRespuestaImgSrc(event.target.value)}}></input><br></br>
                <input placeholder="Ingrese el precio de su item." value={respuestaPrice} onChange={(event)=>{setRespuestaPrice(event.target.value)}}></input><br></br>
                <button onClick={creaItem}>Confirmar</button><button onClick={() => { setCIopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorCI}</p>

          <button onClick={() => { setBIopen(true) }}>
            Borrar
          </button>
          <Popup open={BIopen} onClose={() => { setBIopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdminItem} onChange={(event)=>{setIdAdminItem(event.target.value)}}></input> <button onClick={borrarItem}>Confirmar</button><br></br>
                <button onClick={() => { setBIopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorBI}</p>

          <button onClick={() => { setMIIopen(true) }}>
            Modificar imagen
          </button>
          <Popup open={MIIopen} onClose={() => { setMIIopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de item desea dar al usuario?" value={idAdminItem} onChange={(event)=>{setIdAdminItem(event.target.value)}}></input><br></br>
                <input placeholder="¿Que imagen desea que el item tenga?" value={respuestaImgSrc} onChange={(event)=>{setRespuestaImgSrc(event.target.value)}}></input><br></br>
                <button onClick={modItemImage}>Confirmar</button> <button onClick={() => { setMIIopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
        <p>{mensajeErrorMII}</p>

          <button onClick={() => { setMIPopen(true) }}>
            Modificar precio
          </button>
          <Popup open={MIPopen} onClose={() => { setMIPopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de item desea dar al usuario?" value={idAdminItem} onChange={(event)=>{setIdAdminItem(event.target.value)}}></input><br></br>
                <input placeholder="¿Que imagen desea que el item tenga?" value={respuestaPrice} onChange={(event)=>{setRespuestaPrice(event.target.value)}}></input><br></br>
                <button onClick={modItemPrice}>Confirmar</button> <button onClick={() => { setMIPopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
        <p>{mensajeErrorMIP}</p>

        </div>
        <div className="admin_div">
          <h2 className="admin_h">Cheats</h2>

          <button onClick={() => setXPopen(true)}>
            +500 puntos
          </button>
          <Popup open={XPopen} onClose={() => { setXPopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={cheatPuntos}>Confirmar</button><br></br>
                <button onClick={() => { setXPopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorXP}</p>

          <button onClick={() => setXIopen(true)}>
            Dar todos los items
          </button>
          <Popup open={XIopen} onClose={() => { setXIopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={cheatItems}>Confirmar</button><br></br>
                <button onClick={() => { setXIopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorXI}</p>
        </div>

        <div id="admin_table">
          <div className="divTabla">
            <h3>USUARIOS</h3>
            <table id="ListaDeUsers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Points</th>
                  <th>Password</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {arrayUsuarios.map((element, i) => (
                  <tr key={i}>
                    <td>{element.id}</td>
                    <td>{element.username}</td>
                    <td>{element.points}</td>
                    <td>{element.password}</td>
                    <td>{element.is_admin}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <div className="divTabla">
            <h3>ITEMS</h3>
            <table id="ListaDeItems">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>ImgSrc</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {arrayItems.map((element, i) => (
                  <tr key={i}>
                    <td>{element.id}</td>
                    <td>{element.name}</td>
                    <td>{element.imgsrc}</td>
                    <td>{element.price}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <div className="divTabla">
            <h3>INVENTARIOS</h3>
            <table id="ListaDeInventarios">
              <thead>
                <tr>
                  <th>ID User</th>
                  <th>ID Item</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {arrayIxU.map((element, i) => (
                  <tr key={i}>
                    <td>{element.userid}</td>
                    <td>{element.itemid}</td>
                    <td>{element.active}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}