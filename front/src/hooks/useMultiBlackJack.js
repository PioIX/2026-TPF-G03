/*
pensar si hace falta que la logica contemple los datos de los demas o si eso se maneja por socket y solo hay que pensar los datos del usuario ind
*/
import { useState, useEffect } from 'react';

export const useMultiBlackJack = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]
    const [sum,setSum] = useState([])
    const [ace11,setAce11]= useState([])
    const [ucards,setUCards] = useState([])
    const [wl,setWL] = useState(0)
    

useEffect (()=>{
        let temp=sum
        if (sum>21 & ace11){
            setSum((prev)=>prev-10)
            setAce11(false)
            temp-=10
            
        }
        console.log(`Vos: ${ucards.map((card)=>(card[0]))}`)
        console.log(`Suma: ${temp}`)
        
        if (temp>21){
            console.log("Perdiste")
            setWL(-1)
        }else{
            if(temp==21){
                console.log("Ganaste!")
                setIsUserTurn(false)
                setWL(1)
            }
        
        }
    },[sum])

    const giveusercard= ()=>{
        let usertemp=cards[Math.floor(Math.random() * cards.length)]
        setUCards((prev)=>[...prev,[usertemp,Math.random()>=0.5]])
        if (usertemp=="A"){
            setAce11(true)
            usertemp=11
            setSum((prev)=>prev+11)
        }else{ 
            if(usertemp=="J" || usertemp=="Q" || usertemp=="K"){
                usertemp=10
                setSum((prev)=>prev+10)
            }else{
                setSum((prev)=>prev+usertemp)
            }
        
        }
        return usertemp 
        };


        

    

    const reset = ()=>{
        setSum(0)
        setUCards([])
        setAce11(false)
        setWL(0)
    }
 return {
        sum,
        ucards,
        reset,
        giveusercard,
        wl,
        setWL,
        
    }

}


