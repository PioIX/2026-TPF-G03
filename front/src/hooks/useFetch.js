"use client"
/*GET*/


export function getUsuarios(){
        return fetch(`http://localhost:4000/Usuarios`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getUsuarioPorId(id){
        return fetch(`http://localhost:4000/Usuarios?id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getUsuarioPorUsername(username){
        return fetch(`http://localhost:4000/Usuarios?username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getRanking(){
        return fetch(`http://localhost:4000/Ranking`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getItems(){
        return fetch(`http://localhost:4000/Items`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getItemPorId(id){
        return fetch(`http://localhost:4000/Items?id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getUnItemPorUnUsuario(itemid,userid){
        return fetch(`http://localhost:4000/ItemsporUsuario?itemid=${itemid}&userid=${userid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getInventario(itemid,userid){
        return fetch(`http://localhost:4000/ItemsporUsuario?userid=${userid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getItemsPorUsuario(){
        return fetch(`http://localhost:4000/ItemsporUsuario`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getEstadisticaDeUsuario(userid){
        return fetch(`http://localhost:4000/Estadistica?userid=${userid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getSalas(){
        return fetch(`http://localhost:4000/Salas`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getSalaDeUsuario(){
        return fetch(`http://localhost:4000/Salas?userid=${userid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}

export function getSalasPorActividad(activa){
        return fetch(`http://localhost:4000/Salas?activa=${activa}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}



export function postUsuario(datos){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Usuario creado:', data);
     return data.message

     });
   } catch (error) {
        console.log(error)
   }
};


export function postItem(datos){
   try {
     return fetch('http://localhost:4000/Items', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item creado:', data);
     return data.message
     });
   } catch (error) {
        console.log(error)
   }
};

/*Poner userid, itemid, y active*/
export function postItemPorUsuario(datos){
   try {
     return fetch('http://localhost:4000/ItemsporUsuario', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item añadido al usuario:', data);
     return data.message
     });
   } catch (error) {
        console.log(error)
   }
};


export function postEstadistica(userid){
   try {
     return fetch('http://localhost:4000/Estadistica', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid:parseInt(userid)})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Estadistica creada:', data);
     return data.message
     });
   } catch (error) {
        console.log(error)
   }
};

/*Poner userid, apuesta, y activa*/
export function postSala(datos){
   try {
     return fetch('http://localhost:4000/Salas', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Estadistica creada:', data);
     return data.message
     });
   } catch (error) {
        console.log(error)
   }
};



/*DELETE*/

export function deleteUsuario(id){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id: id})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Usuario:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function deleteItem(id){
   try {
     return fetch('http://localhost:4000/Items', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id: id})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Item:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function deleteItemPorUsuario(userid,itemid){
   try {
     return fetch('http://localhost:4000/ItemsporUsuario', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid: userid,itemid:itemid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete item de un usuario:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function vaciarInventario(userid){
   try {
     return fetch('http://localhost:4000/ItemsporUsuario', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid: userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Items del inventario:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function deleteItemDeTodoInventario(itemid){
   try {
     return fetch('http://localhost:4000/ItemsporUsuario', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({itemid: itemid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Item de todos los inventarios:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function deleteEstadistica(userid){
   try {
     return fetch('http://localhost:4000/ItemsporUsuario', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid: userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Estadistica:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function deleteSala(userid){
   try {
     return fetch('http://localhost:4000/Salas', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid: userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete Sala:', data);
     });
   } catch (error) {
        console.log(error)
   }
};


/*PUT*/

export function putUsername(newuser,id){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,username:newuser})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Usuario actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putPassword(newpass,id){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,password:newpass})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Usuario actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putPoints(newpoints,id){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,points:newpoints})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Usuario actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putAdmin(isadmin,id){
   try {
     return fetch('http://localhost:4000/Usuarios', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,is_admin:isadmin})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Usuario actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putItemName(newname,id){
   try {
     return fetch('http://localhost:4000/Items', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,name:newname})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putItemSRC(imgsrc,id){
   try {
     return fetch('http://localhost:4000/Items', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,imgsrc:imgsrc})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};

export function putPrice(newprice,id){
   try {
     return fetch('http://localhost:4000/Items', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({id:id,price:newprice})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

export function activateItem(itemid,userid){
   try {
     return fetch('http://localhost:4000/onactive', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({itemid:itemid,userid:userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

export function deactivateItem(itemid,userid){
   try {
     return fetch('http://localhost:4000/offactive', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({itemid:itemid,userid:userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Item actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

/*Poner objeto con datos que se quieren cambiar y obligatiorio userid*/
export function putEstadistica(estadistica){
   try {
     return fetch('http://localhost:4000/Estadistica', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(estadistica)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Estadistica actualizada:', data);
     });
   } catch (error) {
        console.log(error)
   }
}; 

export function putApuestaDeSala(apuesta,userid){
   try {
     return fetch('http://localhost:4000/Salas', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid:userid,apuesta:apuesta})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Sala actualizada:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

export function putRondasDeSala(cant_rondas,userid){
   try {
     return fetch('http://localhost:4000/Salas', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid:userid,cant_rondas:cant_rondas})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Sala actualizada:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

export function activarSala(userid){
   try {
     return fetch('http://localhost:4000/activarSala', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid:userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Sala activada:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  

export function desactivarSala(userid){
   try {
     return fetch('http://localhost:4000/desactivarSala', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify({userid:userid})
     })
     .then(response => response.json())
     .then(data => {
     console.log('Sala desactivada:', data);
     });
   } catch (error) {
        console.log(error)
   }
};  