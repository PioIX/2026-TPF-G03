/*
pensar si hace falta que la logica contemple los datos de los demas o si eso se maneja por socket y solo hay que pensar los datos del usuario ind
*/
import { useState, useEffect } from 'react';

export const useMultiBlackJack = () => {
    const cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"]
    const [sum,setSum] = useState([])
    const [ace11,setAce11]= useState([])
    const [ucards,setUCards] = useState([])
    const [held,setHeld] = useState(false)

useEffect (()=>{
        let temp=Number(sum)
        console.log(temp)
        if (sum>21 & ace11){
            console.log("SUM")
            console.log(sum)
            setSum(temp-10)
            setAce11(false)
            temp-=10
            
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
        let usertemp=cards[Math.floor(Math.random() * cards.length)]
        setUCards((prev)=>[...prev,[usertemp,Math.random()>=0.5]])
        if (usertemp=="A"){
            setAce11(true)
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
        setAce11(false)
        setHeld(false)
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


