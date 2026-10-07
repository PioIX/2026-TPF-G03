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




app.get('/', function(req, res){
	res.status(200).send({
		message: `Hola`
	});
});


app.get('/', async function(req, res){
	try {
		let email=req.query.email
		let nombre=req.query.nombre
		let numero=req.query.numero
		if(email){
			resp= await MySQL.realizarQuery(`SELECT * FROM  WHERE email="${email}";`)
		}else if(nombre){
			resp= await MySQL.realizarQuery(`SELECT * FROM  WHERE nombre="${nombre}";`)
		}else if(numero){
			resp= await MySQL.realizarQuery(`SELECT * FROM  WHERE numero=${numero};`)
		}else{

			resp= await MySQL.realizarQuery(`SELECT * FROM ;`)
		}
		res.status(200).send({
			message: resp
		});
	} catch (error) {
		res.status(500).send({
			message: "error"
		})
	}
});



app.post('/', async function(req, res){
		try {
			console.log(req.body);
			const result =await MySQL.realizarQuery(`INSERT INTO Grupos(nombre,foto)
			VALUES ("${req.body.nombre}","${req.body.foto}");`)
			const newID = result.insertId
			console.log(newID);
			res.send({message: newID});
			
		} catch (error) {
			console.log('Error:', error.message)
			res.status(500).send({
				message: "Error al crear el grupo"
			});

		}


});



app.delete('/', async function(req, res){
	try {
		await MySQL.realizarQuery(`DELETE FROM Grupos WHERE id=${req.body.grupo_id};`)
	} catch (error) {
		console.log('Error:', error.message)
		res.status(500).send({
			message: "Error"
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
