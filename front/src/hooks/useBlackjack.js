import { useState, useEffect } from 'react';

export default useBlackJackLogic = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]
    const [dealsum, setDealSum] = useState(0)
    const [usersum,setUserSum] = useState(0)
    const [ace11deal,setAce11deal] = useState(false)
    const [ace11user,setAce11user]= useState(false)
    const [dealcards,setDealCards]= useState([])
    const [usercards,setUserCards] = useState([])
    const [isuserturn,setIsUserTurn] = useState(true)

    const givedealcard = ()=> {
        let dealtemp=cards[Math.floor(Math.random() * cards.length)]
        setDealCards((prev)=>[...prev,[dealtemp,Math.random()>=0.5]])
        if (dealtemp=="A"){
        setDealSum((prev)=>prev+11)
        setAce11deal(true)
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
            setUserSum((prev)=>prev+11)
            setAce11user(true)
        }else{ 
            if(usertemp=="J" || usertemp=="Q" || usertemp=="K"){
                setUserSum((prev)=>prev+10)
            }else{
                setUserSum((prev)=>prev+usertemp)
            }
        
        }
        return usertemp 
        };


    const userTurn = ()=>{
        giveusercard()
        
        if (usersum>21 & ace11user){
            setUserSum((prev)=>prev+10)
            setAce11user(false)
            
        }
        
        console.log(`Dealer: ${dealcards[0]}`)
        console.log(`Suma: ${dealsum}`)
        console.log(`User: ${usercards[0]}`)
        console.log(`Suma: ${usersum}`)
        
        if (usersum>21){
            console.log("Perdiste")
            setIsUserTurn(false)
            return -1
        }else{
            if(usersum==21){
                console.log("Ganaste!")
                setIsUserTurn(false)
                return 1
            }else{
                return 0
            }
        
        }
    }


    const dealerTurn = ()=> {
    // añadir delay que funcione    
        givedealcard()

        if (dealsum>21 & ace11deal){
            setDealSum((prev)=>prev+10)
            setAce11deal(false)
        }
    
        console.log(`Dealer: ${dealcards[0]}`)
        console.log(`Suma: ${dealsum}`)
        console.log(`User: ${usercards[0]}`)
        console.log(`Suma: ${usersum}`)
        if (dealsum>21){
            console.log("Ganaste!")
            return 1
        }else{
            if((dealsum>usersum && dealsum<21) || dealsum==21){
                console.log("Perdiste")
                return -1
            }else{
                return 0
            }
        
        }
    }

    const reset = ()=>{
        setDealSum()
        setUserSum()
        setUserCards([])
        setDealCards([])
        setAce11deal(false)
        setAce11user(false)
        setIsUserTurn(true)
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
        userTurn,
        dealerTurn
    }

}




