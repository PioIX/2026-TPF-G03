"use client"

export function get(dato){
        return fetch(`http://localhost:4000/x?x=${dato}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.message
    });
}


export function post(datos){
   try {
     return fetch('http://localhost:4000/', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(usuario)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Dato creado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};


export function put(datos){
   try {
     return fetch('http://localhost:4000/', {
         method: 'PUT',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Actualizado:', data);
     });
   } catch (error) {
        console.log(error)
   }
};


export function delete(datos){
   try {
     return fetch('http://localhost:4000/', {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
     })
     .then(response => response.json())
     .then(data => {
     console.log('Delete:', data);
     });
   } catch (error) {
        console.log(error)
   }
};
