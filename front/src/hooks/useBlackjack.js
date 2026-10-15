import { useState, useEffect } from 'react';

export const useBlackJackLogic = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]
    const [dealsum, setDealSum] = useState(0)
    const [usersum,setUserSum] = useState(0)
    const [ace11deal,setAce11deal] = useState(false)
    const [ace11user,setAce11user]= useState(false)
    const [dealcards,setDealCards]= useState([])
    const [usercards,setUserCards] = useState([])
    const [isuserturn,setIsUserTurn] = useState(true)
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
    },[usersum])


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




