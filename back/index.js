var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const session = require("express-session");
const MySQL = require('./modulos/mysql');
const app = express();
const PORT = process.env.PORT || 4000;
const { Server } = require("socket.io");


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/*SOCKET*/ 
const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);
const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
	origin: ["http://localhost:3000", "http://localhost:3001"],
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
	//path: "/api/socketio",
	//addTrailingSlash: false,
  },
});


io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});


io.on("connection", (socket) => {
	console.log('connection')
  const req = socket.request;

  socket.on("joinRoom", (data) => {
	if (req.session.room != undefined && req.session.room.length > 0) {
	  socket.leave(req.session.room);
	}
	req.session.room = data.room;
	socket.join(req.session.room);

	io.to(req.session.room).emit("inf", {
	  user: req.session.user,
	  room: req.session.room,
	});
  });

  socket.on("pingAll", (data) => {
	console.log("PING ALL:", data);
	io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
	console.log("Message recieved")
	console.log(data.message)
	io.to(req.session.room).emit("newMessage", {
	  room: req.session.room,
	  message: data.message,
	  
	});
  });


  socket.on("disconnect", () => {
	console.log("Disconnect");
  });
});




/*MYSQL*/ 

/*Pedidos Get*/ 

app.get('/', function(req, res){
	res.status(200).send({
		message: `Hola`
	});
});

app.get('/Ranking', async function(req, res){
	try {
		console.log(req.query)
		respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios order by points desc;`)
		res.status(200).send({
			message: respuesta
		});
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener el ranking"
		});
	}
});


app.get('/Usuarios', async function(req, res){
	try {
		console.log(req.query)
		id=req.query.id
		username=req.query.username
		if (id){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios WHERE id = ${id};`)
		}else{
			if(username){
				respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios WHERE username = "${username}";`)
			}else{
				respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios;`)
			}
		}
		res.status(200).send({
			message: respuesta
		});
		console.log('Usuario enviado')
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener el usuario"
		});
	}
});


app.get('/Items', async function(req, res){
	try {
		console.log(req.query)
		id=req.query.id
		if (id){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Items WHERE id = ${id};`)
		}else{
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Items order by price asc;`)
		}
		res.status(200).send({
			message: respuesta
		});
		console.log('Item enviado')
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener el item"
		});
	}
});



app.get('/ItemsporUsuario', async function(req, res){
	try {
		console.log(req.query)
		userid=req.query.userid
		itemid=req.query.itemid
		if (userid && itemid){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM ItemsporUsuario WHERE userid = ${userid} AND itemid = ${itemid};`)
		}else if (userid){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM ItemsporUsuario WHERE userid = ${userid};`)
		}else{
			respuesta = await MySQL.realizarQuery(`SELECT * FROM ItemsporUsuario;`)
		}
		res.status(200).send({
			message: respuesta
		});
		console.log('ItemporUsuario enviado')
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener el itemporusuario"
		});
	}
});


app.get('/Estadistica', async function(req, res){
	try {
		console.log(req.query)
		userid=req.query.userid
		if (userid){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Estadistica WHERE userid = ${userid};`)
		}else{
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Estadistica;`)
		}
		res.status(200).send({
			message: respuesta
		});
		console.log('Estadistica enviada')
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener la estadística"
		});
	}
});

app.get('/Salas', async function(req, res){
	try {
		console.log(req.query)
		userid=req.query.userid
		activa=req.query.activa
		if (userid){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Salas WHERE userid = ${userid};`)
		}else if(activa!=undefined){
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Salas WHERE activa = ${activa};`)
		}else{
			respuesta = await MySQL.realizarQuery(`SELECT * FROM Salas;`)
		}
		res.status(200).send({
			message: respuesta
		});
		console.log('Salas enviadas')
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al obtener las Salas"
		});
	}
});


/*Pedidos post*/ 

app.post('/Usuarios', async function(req, res){
	try {
		console.log(req.body);
		existe = await MySQL.realizarQuery(`SELECT * FROM Usuarios WHERE username="${req.body.username}";`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO Usuarios (username,password,points,is_admin)
			VALUES ("${req.body.username}", "${req.body.password}", ${req.body.points}, ${req.body.is_admin});`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
		}else{
			res.send({message: "usuario ya existe"})
		};
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al agregar el usuario"
		});

	}
});

app.post('/Items', async function(req, res){
	try {
		console.log(req.body);
		existe = await MySQL.realizarQuery(`SELECT * FROM Items WHERE name="${req.body.name}";`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO Items (name,imgsrc,price)
			VALUES ("${req.body.name}", "${req.body.imgsrc}", ${req.body.price});`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
		}else{
			res.send({message: "Item ya existe"})
		};
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al agregar el item"
		});

	}
});


app.post('/ItemsporUsuario', async function(req, res){
	try {
		console.log(req.body);
		console.log(req.body.userid);
		existe = await MySQL.realizarQuery(`SELECT * FROM ItemsporUsuario WHERE userid=${req.body.userid} AND itemid=${req.body.itemid};`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO ItemsporUsuario (userid,itemid,active)
			VALUES (${req.body.userid},${req.body.itemid},${req.body.active});`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
		}else{
			res.send({message: "Item ya estaba en el usuario"})
		};
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al agregar el item al usuario"
		});

	}
});


app.post('/Estadistica', async function(req, res){
	try {
		console.log(req.body);
		existe = await MySQL.realizarQuery(`SELECT * FROM Estadistica WHERE userid=${req.body.userid};`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO Estadistica(userid,wins,losses,played,streak,points_lost,cant_items)
			VALUES (${req.body.userid}, 0,0, 0, 0, 0, 0);`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
		}else{
			res.send({message: "Estadistica ya existe"})
		};
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al agregar la Estadistica"
		});

	}
});

app.post('/Salas', async function(req, res){
	try {
		console.log(req.body);
		existe = await MySQL.realizarQuery(`SELECT * FROM Salas WHERE userid=${req.body.userid};`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO Salas(userid,activa,cant_rondas,apuesta)
			VALUES (${req.body.userid},${req.body.activa},0,${req.body.apuesta});`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
		}else{
			res.send({message: "Usuario ya tiene sala"})
		};
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al agregar la sala"
		});

	}
});

/*Pedidos delete*/ 

app.delete('/Usuarios', async function(req, res){
	try {
		await MySQL.realizarQuery(`DELETE FROM Usuarios WHERE id = ${req.body.id};`)
		res.send({message: "Usuario eliminado"})
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al eliminar el usuario"
		});
	}
});

app.delete('/Items', async function(req, res){
	try {
		await MySQL.realizarQuery(`DELETE FROM Items WHERE id = ${req.body.id};`)
		res.send({message: "Item eliminado"})
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al eliminar el item"
		});
	}
});


app.delete('/ItemsporUsuario', async function(req, res){
	try {
		if(req.body.userid && req.body.itemid){
			await MySQL.realizarQuery(`SET FOREIGN_KEY_CHECKS = 0;DELETE FROM ItemsporUsuario WHERE userid = ${req.body.userid} AND itemid= ${req.body.itemid};SET FOREIGN_KEY_CHECKS = 1;`)
			res.send({message: "Item eliminado del usuario"})
		}else if(req.body.userid){
			await MySQL.realizarQuery(`SET FOREIGN_KEY_CHECKS = 0;DELETE FROM ItemsporUsuario WHERE userid = ${req.body.userid};SET FOREIGN_KEY_CHECKS = 1;`)
			res.send({message: "Inventario Vaciado"})
		}else if(req.body.itemid){
			await MySQL.realizarQuery(`SET FOREIGN_KEY_CHECKS = 0;DELETE FROM ItemsporUsuario WHERE itemid = ${req.body.itemid};SET FOREIGN_KEY_CHECKS = 1;`)
			res.send({message: "Item eliminado"})
		}

	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al eliminar el item del usuario"
		});
	}
});



app.delete('/Estadistica', async function(req, res){
	try {
		await MySQL.realizarQuery(`DELETE FROM Estadistica WHERE userid = ${req.body.userid};`)
		res.send({message: "Estadistica eliminada del usuario"})
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al eliminar la estadistica"
		});
	}
});

app.delete('/Salas', async function(req, res){
	try {
		await MySQL.realizarQuery(`DELETE FROM Salas WHERE userid = ${req.body.userid};`)
		res.send({message: "Sala eliminada"})
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error al eliminar la sala"
		});
	}
});

/*Pedidos put*/ 

app.put('/Usuarios', async function(req, res){
try {
		let username=req.body.username
		let password=req.body.password
		let points=req.body.points
		let is_admin=req.body.is_admin
		console.log(username,id)
		if(username){
			await MySQL.realizarQuery(`UPDATE Usuarios SET 
			username = "${req.body.username}" WHERE id = ${req.body.id};`)
		}
		else if(password){
			await MySQL.realizarQuery(`UPDATE Usuarios SET 
			password = "${req.body.password}" WHERE id = ${req.body.id};`)
		}else if(points || points==0){
			await MySQL.realizarQuery(`UPDATE Usuarios SET 
			points = ${req.body.points} WHERE id = ${req.body.id};`)
		}else if(is_admin!=undefined){
			await MySQL.realizarQuery(`UPDATE Usuarios SET 
			is_admin = ${req.body.is_admin} WHERE id = ${req.body.id};`)
		}	
		res.send({message: "Usuario actualizado"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al actualizar el usuario"
	});
}
});



app.put('/Items', async function(req, res){
try {
		let name=req.body.name
		let imgsrc=req.body.imgsrc
		let price=req.body.price
		if(name){
			await MySQL.realizarQuery(`UPDATE Items SET 
			name = "${req.body.name}" WHERE id = ${req.body.id};`)
		}
		if(imgsrc){
			await MySQL.realizarQuery(`UPDATE Items SET 
			imgsrc = "${req.body.imgsrc}" WHERE id = ${req.body.id};`)
		}
		if(price || price==0){
			await MySQL.realizarQuery(`UPDATE Items SET 
			price = ${req.body.price} WHERE id = ${req.body.id};`)
		}
		
		res.send({message: "Item actualizado"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al actualizar el item"
	});
}
});


app.put('/Estadistica', async function(req, res){
try {
		let userid=req.body.userid
		let wins=req.body.wins
		let losses=req.body.losses
		let played=req.body.played
		let streak=req.body.streak
		let points_lost=req.body.points_lost
		let cant_items=req.body.cant_items
		console.log(userid)
		if(wins){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			wins = ${req.body.wins} WHERE userid = ${req.body.userid};`)
		}
		if(losses){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			losses = ${req.body.losses} WHERE userid = ${req.body.userid};`)
		}
		if(played){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			played = ${req.body.played} WHERE userid = ${req.body.userid};`)
		}
		if(streak){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			streak = ${req.body.streak} WHERE userid = ${req.body.userid};`)
		}
		if(points_lost){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			points_lost = ${req.body.points_lost} WHERE userid = ${req.body.userid};`)
		}
		if(cant_items){
			await MySQL.realizarQuery(`UPDATE Estadistica SET 
			cant_items = ${req.body.cant_items} WHERE userid = ${req.body.userid};`)
		}
		res.send({message: "Estadística actualizada"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al actualizar la estadística"
	});
}
});

app.put('/Salas', async function(req, res){
try {
		let apuesta=req.body.apuesta
		let cant_rondas=req.body.cant_rondas
		if(apuesta){
			await MySQL.realizarQuery(`UPDATE Salas SET 
			apuesta = "${req.body.apuesta}" WHERE userid = ${req.body.userid};`)
		}
		if(cant_rondas){
			await MySQL.realizarQuery(`UPDATE Salas SET 
			cant_rondas = "${req.body.cant_rondas}" WHERE userid = ${req.body.userid};`)
		}
		res.send({message: "Sala actualizada"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al actualizar la sala"
	});
}
});

app.put('/onactive', async function(req, res){
try {
		await MySQL.realizarQuery(`UPDATE ItemsporUsuario SET 
		active = True WHERE userid = ${req.body.userid} AND itemid = ${req.body.itemid};`)
		res.send({message: "Item activado"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al activar el item"
	});
}
});

app.put('/offactive', async function(req, res){
try {
		await MySQL.realizarQuery(`UPDATE ItemsporUsuario SET 
		active = False WHERE userid = ${req.body.userid} AND itemid = ${req.body.itemid};`)
		res.send({message: "Item desactivado"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al desactivar el item"
	});
}
});


app.put('/activarSala', async function(req, res){
try {
		await MySQL.realizarQuery(`UPDATE Salas SET 
		activa = True WHERE userid = ${req.body.userid};`)
		res.send({message: "Sala activada"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al activar la sala"
	});
}
});

app.put('/desactivarSala', async function(req, res){
try {
		await MySQL.realizarQuery(`UPDATE Salas SET 
		activa = False WHERE userid = ${req.body.userid};`)
		res.send({message: "Sala desactivada"})
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error al desactivar la sala"
	});
}
});