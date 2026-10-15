import { useEffect, useState } from "react";
import Carta from "./Carta.js"

export default function ArrCartas({ cards }) {
  return (
    <>
    <div>
    {cards.map((c,i)=>{
        <Carta card={c[0]} key={i} palo={c[1]}></Carta>
    })}
    </div>
    </>
  );
}