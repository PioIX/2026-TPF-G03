import { useEffect, useState } from "react";

export default function Carta({palo, card}) {
    const [val,setVal]=useState(0)

    const cartasrefP = [
    "img/cartas/AV.png",
    "img/cartas/2V.png",
    "img/cartas/3V.png",
    "img/cartas/4V.png",
    "img/cartas/5V.png",
    "img/cartas/6V.png",
    "img/cartas/7V.png",
    "img/cartas/8V.png",
    "img/cartas/9V.png",
    "img/cartas/10V.png",
    "img/cartas/JV.png",
    "img/cartas/QV.png",
    "img/cartas/KV.png",
    ];
    const cartasrefD = [
    "img/cartas/A0.png",
    "img/cartas/20.png",
    "img/cartas/30.png",
    "img/cartas/40.png",
    "img/cartas/50.png",
    "img/cartas/60.png",
    "img/cartas/70.png",
    "img/cartas/80.png",
    "img/cartas/90.png",
    "img/cartas/100.png",
    "img/cartas/J0.png",
    "img/cartas/Q0.png",
    "img/cartas/KV.png",


    ];

    useEffect(()=>{
        if (card=="A"){
            setVal(0)
        }else if(card=="J"){
            setVal(10)
        }else if(card=="Q"){
            setVal(11)
        }else if(card=="k"){
            setVal(12)
        }else{
            setVal(Number(card)-1)
        }
    },[])
  return (
    <>
    {(palo)?(
        <img src={cartasrefD[val]}></img>
    ):(
        <img src={cartasrefP[val]}></img>
    )}
    
    </>
  );
}