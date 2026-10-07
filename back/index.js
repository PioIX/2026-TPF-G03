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
		}else if("activa" in req.body){
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

app.post('/Sala', async function(req, res){
	try {
		console.log(req.body);
		existe = await MySQL.realizarQuery(`SELECT * FROM Salas WHERE userid=${req.body.userid};`)
		if (existe.length===0){
			const result =await MySQL.realizarQuery(`INSERT INTO Salas(userid,activa,cant_rondas,apuesta)
			VALUES (${req.body.userid},${true},0,${req.body.apuesta});`)
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
		await MySQL.realizarQuery(`SET FOREIGN_KEY_CHECKS = 0;DELETE FROM ItemsporUsuario WHERE userid = ${req.body.userid} AND itemid= ${req.body.itemid};SET FOREIGN_KEY_CHECKS = 1;`)
		res.send({message: "Item eliminado del usuario"})
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

app.delete('/Sala', async function(req, res){
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


app.put('/', async function(req, res){
try {
		let nombre=req.body.nombre
		let numero=req.body.numero
		let contrasena=req.body.contrasena
		let foto_perfil=req.body.foto_perfil
		let email=req.body.email
		if(nombre){
			await MySQL.realizarQuery(`UPDATE Usuarios SET nombre = "${nombre}" WHERE email="${email}";`)
		}
		if(numero){
			await MySQL.realizarQuery(`UPDATE Usuarios SET numero = ${numero} WHERE email="${email}";`)
		}
		if(contrasena){
			await MySQL.realizarQuery(`UPDATE Usuarios SET contrasena = "${contrasena}" WHERE email="${email}";`)
		}
		if(foto_perfil){
			await MySQL.realizarQuery(`UPDATE Usuarios SET foto_perfil = "${foto_perfil}" WHERE email="${email}";`)
		}
} catch (error) {
	console.log('Error:', error.message)
	res.status(500).send({
		message: "Error"
	});
}
});
