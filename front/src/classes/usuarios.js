export default class Usuario{
    constructor(idUser){
        this.username=""
        this.password=""
        this.is_admin=false
        this.points=0
        this.id=idUser
        this.items=[]
    }
    async updateuser(){
        let inv = []
        let newuser= await getUsuarioporID(this.id);
        inv= await getInventario(this.id) || []
        console.log(inv)
        this.username=newuser.username
        this.password=newuser.password
        this.is_admin=newuser.is_admin
        this.points=parseInt(newuser.points)
        this.items=inv
        console.log(this)


    }
}

