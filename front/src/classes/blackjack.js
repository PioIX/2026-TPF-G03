export default class Blackjack{
    constructor(){
        this.cards = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"],
        this.dealsum = 0,
        this.usersum = 0,
        this.ace11deal = false,
        this.ace11user=false,
        this.dealcards= [],
        this.usercards = [],
        this.userturn = true
   
   
   
}


givedealcard() {
    let dealtemp=this.cards[Math.floor(Math.random() * this.cards.length)]
    this.dealcards.push([dealtemp,Math.random()>=0.5])
    if (dealtemp=="A"){
        this.dealsum+=11
        this.ace11deal=true
    }else{ if(dealtemp=="J" || dealtemp=="Q" || dealtemp=="K"){
        this.dealsum+=10
    }else{
        this.dealsum+=dealtemp
    }
    
}
return dealtemp    
}

giveusercard(){
    let usertemp=this.cards[Math.floor(Math.random() * this.cards.length)]
    this.usercards.push([usertemp,Math.random()>=0.5])
    if (usertemp=="A"){
        this.usersum+=11
        this.ace11user=true
    }else{ if(usertemp=="J" || usertemp=="Q" || usertemp=="K"){
        this.usersum+=10
    }else{
        this.usersum+=usertemp
    }
    
}
return usertemp 
}

userTurn(){
    
    this.giveusercard()
    
    if (this.usersum>21 & this.ace11user==true){
        this.usersum-=10
        this.ace11user=false
        
    }
    
    console.log(`Dealer: ${this.dealcards[0]}`)
    console.log(`Suma: ${this.dealsum}`)
    console.log(`User: ${this.usercards[0]}`)
    console.log(`Suma: ${this.usersum}`)
    
    if (this.usersum>21){
        console.log("Perdiste")
        this.userturn=false
        return -1
    }else{if(this.usersum==21){
        console.log("Ganaste!")
        this.userturn=false
        return 1
    }else{
        return 0
    }
    
}

}


dealerTurn(){
 // añadir delay que funcione    
    this.givedealcard()
    
    
        console.log(`Dealer: ${this.dealcards[0]}`)
        console.log(`Suma: ${this.dealsum}`)
        console.log(`User: ${this.usercards[0]}`)
        console.log(`Suma: ${this.usersum}`)
    
    
        if (this.dealsum>21){
            console.log("Ganaste!")
            return 1
        }else{
        if((this.dealsum>this.usersum && this.dealsum<21) || this.dealsum==21){
            console.log("Perdiste")
            return -1
        }else{
            return 0
        }
    
        }


        
        
                
           

    }

}






