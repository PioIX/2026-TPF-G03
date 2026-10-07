export default class Estadistica{
    constructor(userID){
        this.userid=userID
        this.wins=0
        this.losses=0
        this.played=0
        this.streak=0
        this.points_lost=0
        this.cant_items=0
    }
    async updateEstadistica(){
        let newest= await getEstadistica(this.userid);
        this.wins=newest.wins
        this.losses=newest.losses
        this.played=newest.played
        this.streak=newest.streak
        this.points_lost=newest.points_lost
        this.cant_items=newest.cant_items
       
    }
}

