"use client"

import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';

export default function AdminPage() {
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [arrayItems, setArrayItems] = useState([])
  const [arrayIxU, setArrayIxU] = useState([])
  const [CPopen, setCPopen]=useState(false)
  const [CIopen, setCIopen] = useState(false)
  const [AUopen, setAUopen] = useState(false)
  const [AUNopen, setAUNopen] = useState(false)
  const [AIUopen,setAIUopen] = useState(false)
  const [BUopen,setBUopen] = useState(false)
  const [idAdmin, setIdAdmin] = useState("")
  const [idAdminItem, setIdAdminItem] = useState("")
  const [mensajeErrorCP, setMensajeErrorCP] = useState("")
  const [mensajeErrorCI, setMensajeErrorCI] = useState("")
  const [mensajeErrorAU, setMensajeErrorAU] = useState("")
  const [mensajeErrorAUN, setMensajeErrorAUN] = useState("")
  const [mensajeErrorAIU, setMensajeErrorAIU] = useState("")
  const [mensajeErrorBU, setMensajeErrorBU] = useState("")
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
    }
    console.log("Usuario Borrado.")
  }

  /*async function borrarItem() {
    let idAdminItem = prompt("¿Que ID de item desea eliminar?")
    let objetoItem = new Item(idAdminItem)
    let itemFetch = await getItemporID(idAdminItem)
    while (idAdminItem == "" || Object.keys(itemFetch).length === 0) {
      idAdminItem = prompt("Complete con un dato valido.")
      objetoItem = new Item(idAdminItem)
      itemFetch = await getItemporID(idAdminItem)
    }
    deleteItem(idAdminItem)
    alert("Item borrado.")
  }*/

  /*sync function modPuntosUser() {
    let idAdmin = prompt("¿Que ID de usuario desea alterar?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioPorId(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioPorId(idAdmin)
    }
    let newPuntos = prompt("Escriba el nuevo puntaje total del usuario.")
    while (newPuntos == "") {
      newPuntos = prompt("El campo esta vacio.")
    }
    putPoints(newPuntos, idAdmin)
    objetoUsuario.updateuser()
    alert("Puntaje modificado.")
  }*/

  async function cheatPuntos() {
    let aux = await useFetch.getUsuarioPorId(idAdmin)
    if (idAdmin == "" || aux[0] === undefined) {
      setMensajeErrorCP("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorCP("")
      setCPopen(false)
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

  /*async function modItemPrice() {
    let idAdminItem = prompt("¿Que ID de item desea eliminar?")
    let objetoItem = new Item(idAdminItem)
    let itemFetch = await getItemporID(idAdminItem)
    while (idAdminItem == "" || Object.keys(itemFetch).length === 0) {
      idAdminItem = prompt("Complete con un dato valido.")
      objetoItem = new Item(idAdminItem)
      itemFetch = await getItemporID(idAdminItem)
    }
    let newPrice = prompt("Ingrese el nuevo precio de su Item.")
    while (newPrice == "") {
      newPrice = prompt("Llene los campos.")
    }
    putPrice(newPrice, idAdminItem)
    objetoItem.updateitem()
    alert("Precio modificado.")
  }*/

  /*async function modItemImage() {
    let idAdminItem = prompt("¿Que ID de item desea eliminar?")
    let objetoItem = new Item(idAdminItem)
    let itemFetch = await getItemporID(idAdminItem)
    while (idAdminItem == "" || Object.keys(itemFetch).length === 0) {
      idAdminItem = prompt("Complete con un dato valido.")
      objetoItem = new Item(idAdminItem)
      itemFetch = await getItemporID(idAdminItem)
    }
    let newImg = prompt("Ingrese el nuevo archivo de la imagen de su Item.")
    while (newImg == "") {
      newImg = prompt("Llene los campos.")
    }
    putItemSRC(newImg, idAdminItem)
    objetoItem.updateitem()
    alert("Imagen modificada.")
  }*/


  /*async function creaItem() {
    let respuestaName = prompt("Ingrese su nombre de item deseado.");
    while (respuestaName == "") {
      respuestaName = prompt("Valor vacio. Por favor, ingrese uno nuevo.")
    }
    let respuestaImgSrc = prompt("Ingrese el nombre de archivo de la imagen de su item.")
    let arrayItems = await getItems()
    for (i = 0; i < await arrayItems.length; i++) {
      while (respuestaImgSrc == await arrayItems[i].imgsrc || respuestaImgSrc == "") {
        respuestaImgSrc = prompt("Valor vacio o en uso. Completelo.")
      }
      console.log("arrayItems.imgsrc: ", arrayItems[i].imgsrc)
    }
    let respuestaPrice = prompt("Ingrese el precio de su Item.")
    while (respuestaPrice == "") {
      respuestaPrice = prompt("Valor vacio. Completelo.")
    }
    let newItem = {
      name: respuestaName,
      imgsrc: respuestaImgSrc,
      price: respuestaPrice,
      id: arrayItems.length + 1
    };
    postItem(newItem)
    alert("Registro exitoso.")
    console.log(newItem)
    return newItem.id
  }*/

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
      setMensajeErrorAIU("Complete los campos con un ID valido.")
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
      setMensajeErrorCI("Complete el campo con un ID valido.")
    } else {
      setMensajeErrorCI("")
      setCIopen(false)
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

          {/*<button onClick={modPuntosUser}>
            Modificar puntaje
          </button>*/}

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

        {/* <div className="admin_div">
          <h2 className="admin_h">Items</h2>

          <button onClick={creaItem}>
            Crear
          </button>

          <button onClick={borrarItem}>
            Borrar
          </button>

          <button onClick={modItemImage}>
            Modificar imagen
          </button>

          <button onClick={modItemPrice}>
            Modificar precio
          </button>
        </div>*/}
        <div className="admin_div">
          <h2 className="admin_h">Cheats</h2>

          <button onClick={() => setCPopen(true)}>
            +500 puntos
          </button>
          <Popup open={CPopen} onClose={() => { setCPopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={cheatPuntos}>Confirmar</button><br></br>
                <button onClick={() => { setCPopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorCP}</p>

          <button onClick={() => setCIopen(true)}>
            Dar todos los items
          </button>
          <Popup open={CIopen} onClose={() => { setCIopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={cheatItems}>Confirmar</button><br></br>
                <button onClick={() => { setCIopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>
          <p>{mensajeErrorCI}</p>


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