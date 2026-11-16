/*
pensar si hace falta que la logica contemple los datos de los demas o si eso se maneja por socket y solo hay que pensar los datos del usuario ind
*/
import { useState, useEffect, useRef } from 'react';

export const useMultiBlackJack = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]

    const usadas = useRef(new Set())
    const sacarCarta = ()=>{
        const disponibles=[]
        for (const c of cards){
            for (const palo of [true,false]){
                if (!usadas.current.has(`${c}-${palo}`)) disponibles.push([c,palo])
            }
        }
        const carta=disponibles[Math.floor(Math.random() * disponibles.length)]
        usadas.current.add(`${carta[0]}-${carta[1]}`)
        return carta
    }
    const [sum,setSum] = useState([])
    const [ace11,setAce11]= useState(0)
    const [ucards,setUCards] = useState([])
    const [held,setHeld] = useState(false)

useEffect (()=>{
        let temp=Number(sum)
        console.log(temp)
        let aces=ace11
        while (temp>21 && aces>0){
            temp-=10
            aces--
        }
        if (aces!=ace11){
            setSum(temp)
            setAce11(aces)
        }
        console.log(`Vos: ${ucards.map((card)=>(card[0]))}`)
        console.log(`Suma: ${temp}`)
        
        if (temp>21){
            console.log("Perdiste")
            setHeld(true)
        }else{
            if(temp==21){
                console.log("Ganaste!")
                setHeld(true)
            }
        
        }
    },[sum])

    const giveusercard= ()=>{
        let temp=Number(sum)
        console.log(temp)
        const nueva=sacarCarta()
        let usertemp=nueva[0]
        setUCards((prev)=>[...prev,nueva])
        if (usertemp=="A"){
            setAce11((prev)=>prev+1)
            usertemp=11
            setSum(temp+11)
        }else{ 
            if(usertemp=="J" || usertemp=="Q" || usertemp=="K"){
                usertemp=10
                setSum(temp+10)
            }else{
                setSum(temp+usertemp)
            }
        
        }
        return usertemp 
        };


        

    

    const reset = ()=>{
        setSum(0)
        setUCards([])
        setAce11(0)
        setHeld(false)
        usadas.current.clear()
    }
 return {
        sum,
        ucards,
        reset,
        giveusercard,
        held,
        setHeld
        
        
    }

}


