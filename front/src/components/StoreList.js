import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';

export default function StoreList({items, estaEnInv,unequip,equip,buy,names,inf}) {
  const [open,setOpen]=useState(false)
    const [text,setText]=useState(false)

    useEffect(()=>{
      if(text){
        setOpen(true)
      }

    },[text])
    let t=10
  return (
    <>
     <table>
         <thead>
          {/*ver si se necesita*/}
      </thead>
      <tbody>
        {items.map((item,i)=>(
          <tr key={i}>
            {names?(
               <td>{item.name}</td>
            ):(
              <></>
            )}
             
              {/*imgsrc */}
              <td><img src={item.imgsrc} style={{height:"50px"}}></img></td>
              
              {(t=estaEnInv(item.id))==1&&
              <>
              <td><button onClick={()=>{unequip(item)}}>Desequipar</button></td>
              </>}   
              {(t==0)&&
              <>
              <td><button onClick={()=>{equip(item)}}>Equipar</button></td>
              </>}
             {(t==-1)&&
              <>
              <td><button onClick={()=>{buy(item)}}>${item.price}</button></td>
              </>}
              {inf&&
              <>
              {item.name=="Pipi"&&
              <td><button onClick={()=>{setText("El pipi original. Compralo para desbloquear a sus hermanos con habilidades extraordinarias.")}}>Info</button></td>}
            
              {item.name=="Evil Pipi"&&
              <td><button onClick={()=>{setText("El hermano malvado de Pipi. Le gusta comer tus puntos, pero tiene una chance de vomitar y triplicar tus ganancias.")}}>Info</button></td>}
              
              {item.name=="Pipi loco"&&
              <td><button onClick={()=>{setText("Un pipi desorientado. Puede restarte o sumarte puntos aleatoriamente.")}}>Info</button></td>}
              
              {item.name=="Pipi clasista"&&
              <td><button onClick={()=>{setText("Un pipi que se rehusa a funcionar cuando tenés pocos puntos, pero cuando no, te multiplica tus ganancias por 1,5.")}}>Info</button></td>}
              
              {item.name=="Pipi responsable"&&
              <td><button onClick={()=>{setText("Un pipi consistente. Siempre multiplica tus ganancias por 1,25")}}>Info</button></td>}
              </>}
          </tr>

        ))}
      </tbody>
      </table>

      <Popup open={open} onClose={()=>{setOpen(false);setText("")}} closeOnDocumentClick={true}>
        <p>{text}</p>
        </Popup>
    </>
  );
}