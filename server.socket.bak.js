const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
	cors: {
		origin: '*'
	}
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
	debug: true,
});
//
// app.use("/peerjs", peerServer);
// app.use(express.static("public"));



const createNewRoom = () => {
	return 'test';
}



// create room
app.get('/create-room', (req, res) => {
	try{
		const newRoomId = createNewRoom();
		const answer = {
			roomId: newRoomId
		}

		io.of('/create-room').adapter.on("create-room", (room) => {
			console.log(`room ${room} was created`);
		});


		res.json(answer)
		console.log('try')
	}
	catch (e) {
		res.status(500).send({ error: 'Something failed! Error: ' + e });
		console.log(e)
	}
})



// join room
app.get('/room', (req, res) => {
	try{

		io.emit("join", req.params.roomId);


		res.json(answer)
		console.log('try')
	}
	catch (e) {
		res.status(500).send({ error: 'Something failed! Error: ' + e });
		console.log(e)
	}
})

// join/leave to room
const manager = io.on('connection', function (socket) {
	socket.on("join", function(roomid){
		socket.join(roomid);
		manager.to(roomid).emit('connected',roomid);
	});
	socket.on("leave", function(roomid){
		socket.leave(roomid);
		manager.to(roomid).emit(`user ${socket.id} has left the room`);
	});

});

app.use("/", (req, res) => res.send('ok'));

// io.on("connection", (socket) => {
// 	socket.on("join-room", (roomId, userId, userName) => {
// 		socket.join(roomId);
// 		socket.to(roomId).broadcast.emit("user-connected", userId);
// 		socket.on("message", (message) => {
// 			io.to(roomId).emit("createMessage", message, userName);
// 		});
// 	});
// });

server.listen(process.env.PORT || 3030);