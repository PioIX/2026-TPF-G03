"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
import StoreList from "@/components/StoreList";
import Popup from 'reactjs-popup';

/*IDEAS PARA PIPIS:
PIPI QUE TE MULTIPLICA LOS PUNTOS (pipi responsable)
PIPI RANDOM QUE RESTA O SUMA PUNTOS (pipi loco)
PIPI CLICKER (normal)
PIPI QUE NO FUNCIONA SI SOS POBRE, pero si funciona ? (pipi clasista)
PIPI QUE SE COME PUNTOS CADA APUESTA PERO TIENE CHANCE DE SUMAR MUCHOS PUNTOS (evil pipi)


alguno tiene agenda política
hay beef entre pipis
*/

export default function TiendaPage() {
    const [items,setItems]=useState([])
    const [fondos,setFondos]=useState([])
    const [pipis,setPipis]=useState([])

    const [misc,setMisc]=useState([])

    const [usuario,setUsuario]=useState({})
    const [inv,setInv]=useState(null)
    const [loading,setLoading]=useState(true)
    const [Iloading,setILoading]=useState(false)
    const [open,setOpen]=useState(false)
    const [Copen,setCOpen]=useState(false)

     const [rarity,setRarity]=useState("")
    const [gottenItem,setGottenItem]=useState(null)
    const [pipi,setPipi]=useState(null)
    const [item,setItem]=useState(null)
    const [fondo,setFondo]=useState(null)

    let t=-2
    let usuarioId = 0
    const router = useRouter()
  
    useEffect(()=>{
      usuarioId=localStorage.getItem("userid")
      console.log(usuarioId)
      if (!Number(usuarioId)){
       router.replace("./")}
      useFetch.getUsuarioPorId(usuarioId)
      .then((data)=>{
        setUsuario(data[0])
        useFetch.getItems(usuarioId)
        .then((data)=>{
          setItems(data)
        })
        .then(
          useFetch.getInventario(usuarioId)
          .then((data)=>{
            setInv(data)
            if(localStorage.getItem("Fondo")){
              setFondo(JSON.parse(localStorage.getItem("Fondo")))
            }
            if(localStorage.getItem("Pipi")){
              setPipi(JSON.parse(localStorage.getItem("Pipi")))
            }
            if(localStorage.getItem("Misc")){
              setItem(JSON.parse(localStorage.getItem("Misc")))
            }
          })
          )
      })
    },[])
 

    useEffect(()=>{
      if(Iloading){
        useFetch.getInventario(usuario.id)
          .then((data)=>{
            setInv(data)
            setLoading(true)
          })
          
      }
    },[Iloading])

    useEffect(()=>{
      if(Iloading){
        setILoading(false)
        setLoading(true)
      }
    },[inv])


 useEffect(()=>{
      if(gottenItem &&rarity){
        setCOpen(true)
      }
    },[gottenItem,rarity])

    useEffect(()=>{
      if(inv&&fondos.length!=0&&Object.keys(usuario).length!=0&&misc.length!=0&&loading&&pipis.length!=0){
        setLoading(false)
      }
    },[usuario,fondos,misc,loading,inv,pipis])
    
    useEffect(()=>{
      let f=[]
      let m=[]
      let p=[]
      if(inv){

        items.map((it)=>{
          if(it.name.includes("Fondo")){
            f.push(it)
          }else if(it.name.includes("Pipi")){
            if(it.name=="Pipi"||estaEnInv(9)>-1){
              console.log(it)
              console.log("Es pipi o tiene a pipi")
              p.push(it)
            }
          }else{
            m.push(it)
          }
          })
          setFondos(f)
          setMisc(m)
          setPipis(p)
      }
    },[items,inv])

    function estaEnInv(id){
      let temp=-1
        inv.map((item,i)=>{
          if (item.itemid==id){
            if(item.active){
              temp= 1
            }else{
              temp= 0

            }
          }
        })
  
      return temp
    }
  

    function equip(item){
      //check si otro item del mismo tipo está equipado
      let act=inv.filter((i)=>i.active)
      let t
      let f=0
      let m=0
      let p=0
      if(act.length!=0){
        act.map((it)=>(
          useFetch.getItemPorId(it.itemid)
          .then((data)=>{
            t=data[0]
            if(t.name.includes("Fondo")){
               f=t.id
              if(item.name.includes("Fondo")){
                
                useFetch.deactivateItem(f,usuario.id)
                 .then(()=>{
                  setILoading(true)
                })
              }
            }else if(t.name.includes("Pipi")){
              p=t.id
              if(item.name.includes("Pipi")){
                useFetch.deactivateItem(p,usuario.id)
                 .then(()=>{
                  setILoading(true)
                })
              }
            }else{
              m=t.id
              if(!item.name.includes("Fondo")&&!item.name.includes("Pipi")){
                useFetch.deactivateItem(m,usuario.id)
                .then(()=>{
                  setILoading(true)
                })
              }
            }
          })
        ))
      }
      useFetch.activateItem(item.id,usuario.id)
      .then(()=>{setILoading(true);
        if(item.name.includes("Fondo")){
          localStorage.setItem("Fondo", JSON.stringify(item))
          setFondo(item)
        }else if(item.name.includes("Pipi")){
          localStorage.setItem("Pipi", JSON.stringify(item))
          setPipi(item)
        }else{
          localStorage.setItem("Misc", JSON.stringify(item))
          setItem(item)
        }
      })
    }
    
    function unequip(item){
        if(item.name.includes("Fondo")){
          localStorage.removeItem("Fondo")
          setFondo(null)
        }else if(item.name.includes("Pipi")){
          localStorage.removeItem("Pipi")
          setPipi(null)
        }else{
          localStorage.removeItem("Misc")
          setItem(null)
        }
      useFetch.deactivateItem(item.id,usuario.id)
      .then(()=>{setILoading(true)})
    }

    //chequear si funciona la compra
    function buy(item){
      if(usuario.points<item.price){
        console.log("Puntos insuficientes")
        setOpen(true)
      }else{
        //popup para confirmar compra
        let e
        useFetch.getEstadisticaDeUsuario(usuario.id)
        .then((data)=>{ 
          e=data[0]
          let newitem ={
            userid: usuario.id,
            itemid: item.id,
            active: 0   
            }
          useFetch.postItemPorUsuario(newitem)
          .then(()=>{
            let t=usuario
            t.points-=price
            useFetch.putEstadistica({cant_items: e.cant_items+1, userid: usuario.id}),
            useFetch.putPoints(t.points,usuario.id)
            setUsuario(t)
            .then(
              ()=>{setILoading(true)})
            
          }
          )
        })
      }
    }

  function pickItem(price){
    let im
    let rand = Math.floor(Math.random()*20)
    if(rand==1){
      im = 5 //mandarina
      console.log("5")
      setRarity("Legendario")
      //item raro, 1 en 20 chance
    }else if(rand<=6){
      console.log("2")
      setRarity("Épico")
      im=2 //corazón
      //item no tan raro, 5 en 20 chance
    }else if (rand<=12){
      console.log("1")
       setRarity("Raro")
      im=1 //café
      //6 en 20
    }else{
      console.log("4")
      setRarity("Comùn")

      im=4 //té
      //8 en 20
    }
   useFetch.getItemPorId(im)
    .then((data)=>{
      setGottenItem(data[0])
    })
   let e
        useFetch.getEstadisticaDeUsuario(usuario.id)
        .then((data)=>{ 
          e=data[0]
          let newitem ={
            userid: usuario.id,
            itemid: im,
            active: 0   
            }
          useFetch.postItemPorUsuario(newitem)
          .then(()=>{

            let t = usuario
            t.points-=price
            setUsuario(t)
            useFetch.putEstadistica({cant_items: e.cant_items+1, userid: usuario.id}),
            useFetch.putPoints(t.points,usuario.id)
            .then(
              ()=>{setILoading(true)})
            
          }
          )
        })

  }

  return (
    <>
    {loading?(<>
    <h1>Cargando tienda...</h1>
    
    </>):(<>
    {fondo&&
          <h2>Fondo equipado:{fondo.name}</h2>}
        {pipi&&
          <h2>Pipi equipado:{pipi.name}</h2>}
        {item&&
          <h2>Item equipado:{item.name}</h2>}
    <h1>Tienda</h1>
    <p>Tus puntos: {usuario.points}</p>
    <div style={{height:"400px",overflowY:"scroll"}}>
      {/*names define si aparecen los nombres en la tienda, inf si aparecen botones que dan info de cada uno*/}
      <h2>Fondos</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={fondos} estaEnInv={estaEnInv} names={false} inf={false}></StoreList>
     <h2>Pipis</h2>
     <StoreList equip={equip} unequip={unequip} buy={buy} items={pipis} estaEnInv={estaEnInv} names={true} inf={true}></StoreList>
{ /*<StoreList equip={equip} unequip={unequip} buy={buy} items={misc} estaEnInv={estaEnInv} names={false} inf={false}></StoreList>*/}
     <h2>Items</h2>
     <button onClick={()=>{if(usuario.points<20){setOpen(true)}else{pickItem(20)}}}>Comprar cofre de items ($20)</button>
    </div>
      <button onClick={()=>{router.back()}}>Volver</button>


       <Popup open={open} onClose={()=>{setOpen(false)}} closeOnDocumentClick={true}>
              {usuario&&
                <div>
                  <h2>No tiene suficientes puntos para hacer esta compra</h2>
                  <button onClick={()=>{setOpen(false)}}>Cerrar</button>
                </div>       
                      }
             </Popup>


             <Popup open={Copen} onClose={()=>{setCOpen(false)}} closeOnDocumentClick={true}>
              {gottenItem&&rarity&&
                <div>
                  <h2>Recibiste un/a {gottenItem.name}</h2>
                  <img src={gottenItem.src}></img>
                  <p>{rarity}</p>
                  <button onClick={()=>{setCOpen(false);setGottenItem(null),setRarity("")}}>Cerrar</button>
                </div>       
                      }
             </Popup>

    </>)}
    </>
  );
}