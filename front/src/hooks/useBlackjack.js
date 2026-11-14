import { useState, useEffect, useRef } from 'react';

export const useBlackJackLogic = () => {
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
    const [dealsum, setDealSum] = useState(0)
    const [usersum,setUserSum] = useState(0)
    const [ace11deal,setAce11deal] = useState(0)
    const [ace11user,setAce11user]= useState(0)
    const [dealcards,setDealCards]= useState([])
    const [usercards,setUserCards] = useState([])
    const [isuserturn,setIsUserTurn] = useState(true)
    const [wl,setWL] = useState(0)
    

useEffect (()=>{
        let temp=usersum
        let aces=ace11user
        while (temp>21 && aces>0){
            temp-=10
            aces--
        }
        if (aces!=ace11user){
            const bajados=ace11user-aces
            setUserSum((prev)=>prev-10*bajados)
            setAce11user(aces)
        }
        
        console.log(`Dealer: ${dealcards.map((card)=>(card[0]))}`)
        console.log(`Suma: ${dealsum}`)
        console.log(`User: ${usercards.map((card)=>(card[0]))}`)
        console.log(`Suma: ${temp}`)
        
        if (temp>21){
            console.log("Perdiste")
            setIsUserTurn(false)
            setWL(-1)
        }else{
            if(temp==21){
                console.log("Ganaste!")
                setIsUserTurn(false)
                setWL(1)
            }
        
        }
    },[usersum])


    useEffect(()=> {
        if (!isuserturn){
            let temp =dealsum
            let aces=ace11deal
            while (temp>21 && aces>0){
                temp-=10
                aces--
            }
            if (aces!=ace11deal){
                const bajados=ace11deal-aces
                setDealSum((prev)=>prev-10*bajados)
                setAce11deal(aces)
            }
        
            console.log(`Dealer: ${dealcards.map((card)=>(card[0]))}`)
            console.log(`Suma: ${temp}`)
            console.log(`User: ${usercards.map((card)=>(card[0]))}`)
            console.log(`Suma: ${usersum}`)
            if (temp>21){
                console.log("Ganaste!")
                setWL(1)
            }else{
                if((temp>usersum && temp<21) || temp==21){
                    console.log("Perdiste")
                    setWL(-1)
                }
            
            }

        }
    },[dealsum])


    const givedealcard = ()=> {
        const nueva=sacarCarta()
        let dealtemp=nueva[0]
        setDealCards((prev)=>[...prev,nueva])
        if (dealtemp=="A"){
        setAce11deal((prev)=>prev+1)
        setDealSum((prev)=>prev+11)
        }else{ 
            if(dealtemp=="J" || dealtemp=="Q" || dealtemp=="K"){
                setDealSum((prev)=>prev+10)
            }else{
                setDealSum((prev)=>prev+dealtemp)
            }
        }
        return dealtemp    
        };

    const giveusercard= ()=>{
        const nueva=sacarCarta()
        let usertemp=nueva[0]
        setUserCards((prev)=>[...prev,nueva])
        if (usertemp=="A"){
            setAce11user((prev)=>prev+1)
            usertemp=11
            setUserSum((prev)=>prev+11)
        }else{ 
            if(usertemp=="J" || usertemp=="Q" || usertemp=="K"){
                usertemp=10
                setUserSum((prev)=>prev+10)
            }else{
                setUserSum((prev)=>prev+usertemp)
            }
        
        }
        return usertemp 
        };


        

    

    const reset = ()=>{
        setDealSum(0)
        setUserSum(0)
        setUserCards([])
        setDealCards([])
        setAce11deal(0)
        setAce11user(0)
        setIsUserTurn(true)
        setWL(0)
        usadas.current.clear()
    }
 return {
        usersum,
        dealsum,
        isuserturn,
        usercards,
        dealcards,
        reset,
        givedealcard,
        giveusercard,
        wl,
        setWL,
        setIsUserTurn
    }

}




