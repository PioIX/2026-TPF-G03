/*
pensar si hace falta que la logica contemple los datos de los demas o si eso se maneja por socket y solo hay que pensar los datos del usuario ind

import { useState, useEffect } from 'react';

export const useMultiBlackJack = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]
    const [players,setPlayers]=useState([{sum:0,ace11:false,ucards:[],turn:false}])
    const [sums,setSums] = useState([])
    const [ace11s,setAce11s]= useState([])
    const [ucards,setUCards] = useState([])
    const [turn,setTurn] = useState(-1)
    const [wl,setWL] = useState(0)
    

useEffect (()=>{
        let temp=usersum
        if (usersum>21 & ace11user){
            setUserSum((prev)=>prev-10)
            setAce11user(false)
            temp-=10
            
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
    },[sums])


    useEffect(()=> {
        if (!isuserturn){
            let temp =dealsum
            if (dealsum>21 & ace11deal){
                console.log("HELP")
                setDealSum((prev)=>prev-10)
                setAce11deal(false)
                temp-=10
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
        let dealtemp=cards[Math.floor(Math.random() * cards.length)]
        setDealCards((prev)=>[...prev,[dealtemp,Math.random()>=0.5]])
        if (dealtemp=="A"){
        setAce11deal(true)
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
        let usertemp=cards[Math.floor(Math.random() * cards.length)]
        setUserCards((prev)=>[...prev,[usertemp,Math.random()>=0.5]])
        if (usertemp=="A"){
            setAce11user(true)
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
        setAce11deal(false)
        setAce11user(false)
        setIsUserTurn(true)
        setWL(0)
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




*/