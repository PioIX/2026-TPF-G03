"use client"
import Button from '@/components/Button';

import { useEffect, useState } from "react";
import * as fetch from "@/hooks/fetch.js"
import { useRouter } from "next/navigation"

export default function HomePage() {
 


  return (
    <>
      <header>
          <Button id={btnlogout} onClick={logout}>

          </Button>
          <Button id={btnprofile} onClick={showstats()}>
            
  
          </Button>
      </header>
      <div id={title}>
        <h1 id={titleh1}> Blackjack </h1>  
      </div>  
      <section id={buttons}>
        <Button onClick={handleSignup()}>
          Registro
        </Button>
        <Button onClick={handleLogin()}> Login

        </Button>
        <div id={btnjugar}>
          <Button id={iniciar} onClick={handleirs()}><span className='decoration'></span> Jugar <span className='decoration'></span> </Button>
        </div>
        <div id={tr}>
          <Button onClick={handleTienda()}>
            Tienda         
          </Button>
          <Button onClick={socketpocketlalala}  /*window.location.href='ranking.html*/>
            Ranking
          </Button>
        </div>
      </section>
      <p id={homeaviso}></p>
      <div id={divdialog}>
        <dialog id={dialogpoints}>
          <h2 id={ppoints}><span className={decoration}></span> Seleccione cuantos puntos quiere apostar<span className={decoration}></span></h2>
          <div id={pi}>
            <p> Tus puntos: <span id={showuserpoints}></span></p>
            <input type="number" id={inputpoints}></input>
          </div>

          <Button id={confirmpoints} className={btndialog} >Enviar</Button>
        </dialog>
      </div>
    </>
  );
}

/*
  <p id="homeaviso"></p>

    
    
    <dialog id="dialogpoints">
      
  <h2 id="ppoints"><span class="decoration"></span>Seleccione cuántos puntos quiere apostar<span class="decoration"></span></h2>
  <div id="pi">
     <p>Tus puntos: <span  id="showuserpoints"></span></p>
  <input type="number" id="inputpoints">
  </div>
 
  <button id="confirmpoints" class="btndialog" >Enviar</button>
    </dialog>
*/ 