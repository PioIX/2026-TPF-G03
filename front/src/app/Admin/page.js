"use client"

import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import Popup from 'reactjs-popup';

export default function AdminPage() {
  const [arrayUsuarios, setArrayUsuarios] = useState([])
  const [arrayItems, setArrayItems] = useState([])
  const [arrayIxU, setArrayIxU] = useState([])
  const [Eopen,setEopen]=useState(false)
  const [idAdmin, setIdAdmin] = useState("")

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

  /*async function borrarUser() {
    let idAdmin = prompt("¿Que ID de usuario desea eliminar?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    deleteUsuario(idAdmin)
    alert("Usuario Borrado.")
  }*/

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
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    let newPuntos = prompt("Escriba el nuevo puntaje total del usuario.")
    while (newPuntos == "") {
      newPuntos = prompt("El campo esta vacio.")
    }
    putPoints(newPuntos, idAdmin)
    objetoUsuario.updateuser()
    alert("Puntaje modificado.")
  }*/

  function cheatPuntos() {
    if (idAdmin == "" || Object.keys(useFetch.getUsuarioporID(idAdmin)).length === 0) {
      setMensajeError("Complete el campo con un ID valido.")
    } else {
      let newPuntos = useFetch.getUsuarioporID(idAdmin).points + 500
      useFetch.putPoints(newPuntos, idAdmin)
    }

  }

  /*async function adminUser() {
    let idAdmin = prompt("¿Que ID de usuario desea alterar?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    putAdmin(true, idAdmin)
    objetoUsuario.updateuser()
    alert("Administrador designado.")
  }*/

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

  /*async function adminUserNon() {
    let idAdmin = prompt("¿Que ID de usuario desea alterar?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    putAdmin(false, idAdmin)
    objetoUsuario.updateuser()
    alert("Administrador descartado.")
  }*/

  /*async function addItemUser() {
    let idAdmin = prompt("¿Que ID de usuario desea añadir el item?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    let idAdminItem = prompt("Escriba el ID del item que le dara al usuario.")
    let objetoItem = new Item(idAdminItem)
    let itemFetch = await getItemporID(idAdminItem)
    while (idAdminItem == "" || Object.keys(itemFetch).length === 0) {
      idAdminItem = prompt("Complete con un dato valido.")
      objetoItem = new Item(idAdminItem)
      itemFetch = await getItemporID(idAdminItem)
    }
    newItemUser = {
      userid: idAdmin,
      itemid: idAdminItem,
      active: 0
    }
    postItemporUsuario(newItemUser)
    alert("Item añadido al usuario.")
  }*/

  /*async function cheatItems() {
    let idAdmin = prompt("¿Que ID de usuario desea alterar?")
    let objetoUsuario = new Usuario(idAdmin)
    let userFetch = await getUsuarioporID(idAdmin)
    while (idAdmin == "" || Object.keys(userFetch).length === 0) {
      idAdmin = prompt("Complete el campo con un ID valido.")
      objetoUsuario = new Usuario(idAdmin)
      userFetch = await getUsuarioporID(idAdmin)
    }
    let allItems = await getItems()
    for (i = 0; i < allItems.length; i++) {
      let idAllItems = allItems[i].id
      console.log(idAllItems)
      currentItem = {
        userid: idAdmin,
        itemid: idAllItems,
        active: 0
      }
      postItemporUsuario(currentItem)
    }
    alert("Todos los items añadidos al usuario.")
  }*/

  return (
    <>
      <div>
        <h1 id="admin_h1" className="admin_h">ADMINISTRACION</h1>

        <div className="admin_div">
          <h2 className="admin_h">Usuarios </h2>

          {/* <button onclick={borrarUser}>
            Eliminar
          </button> */}

          {/* <button onclick={adminUser}>
            Designar como administrador
          </button> */}

          {/* <button onclick={adminUserNon}>
            Descartar como administrador
          </button> */}

          {/* <button onclick={modPuntosUser}>
            Modificar puntaje
          </button>

          <button onclick={addItemUser}>
            Añadir items
          </button> */}
        </div>

        {/* <div className="admin_div">
          <h2 className="admin_h">Items</h2>

          <button onclick={creaItem}>
            Crear
          </button>

          <button onclick={borrarItem}>
            Borrar
          </button>

          <button onclick={modItemImage}>
            Modificar imagen
          </button>

          <button onclick={modItemPrice}>
            Modificar precio
          </button>
        </div>*/}
        <div className="admin_div">
          <h2 className="admin_h">Cheats</h2>

          <button onClick={() => setEopen(true)}>
            +500 puntos
          </button>
          <Popup open={Eopen} onClose={() => { setEopen(false) }} closeOnDocumentClick={false}>
            {arrayUsuarios &&
              <>
                <input placeholder="¿Que ID de usuario desea alterar?" value={idAdmin} onChange={(event)=>{setIdAdmin(event.target.value)}}></input> <button onClick={cheatPuntos}>Confirmar</button><br></br>
                <button onClick={() => { setEopen(false) }}>Cerrar</button>
              </>
            }
          </Popup>

          {/* <button onclick={cheatItems}>
            Dar todos los items
          </button> */}
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
                    <td>{element.itemid}</td>
                    <td>{element.userid}</td>
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