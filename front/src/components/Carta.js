export default function Carta({palo, card}) {
    const cartasrefP = [
    "/cartas/AV.png",
    "/cartas/2V.png",
    "/cartas/3V.png",
    "/cartas/4V.png",
    "/cartas/5V.png",
    "/cartas/6V.png",
    "/cartas/7V.png",
    "/cartas/8V.png",
    "/cartas/9V.png",
    "/cartas/10V.png",
    "/cartas/JV.png",
    "/cartas/QV.png",
    "/cartas/KV.png",
    ];
    const cartasrefD = [
    "/cartas/A0.png",
    "/cartas/20.png",
    "/cartas/30.png",
    "/cartas/40.png",
    "/cartas/50.png",
    "/cartas/60.png",
    "/cartas/70.png",
    "/cartas/80.png",
    "/cartas/90.png",
    "/cartas/100.png",
    "/cartas/J0.png",
    "/cartas/Q0.png",
    "/cartas/KV.png",


    ];

    let val
    if (card=="A"){
        val=0
    }else if(card=="J"){
        val=10
    }else if(card=="Q"){
        val=11
    }else if(card=="K"){
        val=12
    }else{
        val=Number(card)-1
    }
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