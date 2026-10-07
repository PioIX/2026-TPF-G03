export default class Item{
    constructor(idItem){
        this.name=""
        this.imgsrc=""
        this.price=""
        this.id=idItem
    }
    async updateitem(){
        let newitem= await getItemporID(this.id);
        this.name=newitem.name
        this.imgsrc=newitem.imgsrc
        this.price=newitem.price
    }
}

