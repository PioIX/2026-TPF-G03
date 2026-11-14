import { useEffect, useState } from "react";
import Carta from "./Carta.js"
import styles from './ArrCartas.module.css';

export default function ArrCartas({ cards }) {
  return (
    <>
    <div className={styles.cards}>
    {cards.map((c,i)=>( 
        <Carta card={c[0]} key={`${i}-${c[0]}-${c[1]}`} palo={c[1]}></Carta>
    ))}
    </div>
    </>
  );
}