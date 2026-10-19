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
              <td><img></img></td>
              
              {(t=estaEnInv(item.id))==1&&
              <>
              <td><button onClick={()=>{unequip(item.id)}}>Desequipar</button></td>
              </>}   
              {(t==0)&&
              <>
              <td><button onClick={()=>{equip(item.id)}}>Equipar</button></td>
              </>}
             {(t==-1)&&
              <>
              <td><button onClick={()=>{buy(item.id)}}>Comprar</button></td>
              </>}
          </tr>
        ))}
      </tbody>
      </table>
    </>
  );
}