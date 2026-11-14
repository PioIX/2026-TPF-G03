import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import clsx from "clsx";
import { Press_Start_2P } from "next/font/google";
import styles from './StoreList.module.css';
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });
const popupProps = {
  contentStyle: { background: "none", border: "none", padding: 0, width: "auto" },
  overlayStyle: { background: "rgba(0,0,0,0.65)" },
};
export default function StoreList({items, estaEnInv,unequip,equip,buy,names,inf}) {
  const [open,setOpen]=useState(false)
    const [text,setText]=useState(false)
    const [title,setTitle]=useState("")

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
              {item.name.includes("Fondo")?
              <td><img src={item.imgsrc} style={{height:"80px"}}></img></td>
              :
              <td><img src={item.imgsrc} style={{height:"50px"}}></img></td>

              }
              
              {(t=estaEnInv(item.id))==1&&
              <>
              <td><button  className={styles.btn} onClick={()=>{unequip(item)}}>Desequipar</button></td>
              </>}   
              {(t==0)&&
              <>
              <td><button  className={styles.btn} onClick={()=>{equip(item)}}>Equipar</button></td>
              </>}
             {(t==-1)&&
              <>
              <td><button  className={styles.btn} onClick={()=>{buy(item)}}>${item.price}</button></td>
              </>}
              {inf&&
              <>
              {item.name=="Pipi"&&
              <td><button  className={styles.inf} onClick={()=>{setTitle(item.name);setText("El pipi original. Compralo para desbloquear a sus hermanos con habilidades extraordinarias.")}}>Info</button></td>}
            
              {item.name=="Evil Pipi"&&
              <td><button  className={styles.inf} onClick={()=>{setTitle(item.name);setText("El hermano malvado de Pipi. Le gusta comer tus puntos, pero tiene una chance de vomitar y triplicar tus ganancias.")}}>Info</button></td>}
              
              {item.name=="Pipi loco"&&
              <td><button  className={styles.inf} onClick={()=>{setTitle(item.name);setText("Un pipi desorientado. Puede restarte o sumarte puntos aleatoriamente.")}}>Info</button></td>}
              
              {item.name=="Pipi clasista"&&
              <td><button  className={styles.inf} onClick={()=>{setTitle(item.name);setText("Un pipi que se rehusa a funcionar cuando tenés pocos puntos, pero cuando no, te multiplica tus ganancias por 1,5.")}}>Info</button></td>}
              
              {item.name=="Pipi responsable"&&
              <td><button  className={styles.inf} onClick={()=>{setTitle(item.name);setText("Un pipi consistente. Siempre multiplica tus ganancias por 1,25")}}>Info</button></td>}
              </>}
          </tr>

        ))}
      </tbody>
      </table>

      <Popup open={open} onClose={()=>{setOpen(false);setText("")}} closeOnDocumentClick={true} {...popupProps}>
        <div className={clsx(styles.infoBox, pixel.className)}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <p className={styles.infoText}>{text}</p>
          <button className={clsx(styles.inf, styles.closeBtn)} onClick={()=>{setOpen(false);setText("")}}>Cerrar</button>
        </div>
      </Popup>
    </>
  );
}