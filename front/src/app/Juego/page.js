"use client"
import { useEffect, useState } from "react";
import * as useFetch from "@/hooks/useFetch.js"
import { useRouter } from "next/navigation"
// ejemplo de uso del hook
import {useBlackJackLogic} from "@/hooks/useblackjack"

export default function JuegoPage() {
 
  const {usersum,dealsum,isuserturn,usercards,dealcards,reset,givedealcard,giveusercard,dealerTurn,userTurn} = useBlackJackLogic()
  

  return (
    <>
    
    </>
  );
}