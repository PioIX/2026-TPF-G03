import { useEffect, useState } from "react";

export default function StoreList({items, estaEnInv,unequip,equip,buy}) {
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
              <td>{item.name}</td>
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
          </tr>
        ))}
      </tbody>
      </table>
    </>
  );
}