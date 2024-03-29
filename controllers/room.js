
const { v4: uuidv4 } = require('uuid');


module.exports.create = async function (req, res){
    const io = req.app.get('io')();
    try{
        const socketId  = req.body.socketId;
        const socket  = io.sockets.sockets.get(socketId);

        const newRoomId = uuidv4();

        const answer = {
            roomId: newRoomId
        }
        io.emit('create-room', newRoomId);

        socket.join(newRoomId);

        res.status(201).json(answer)
    }
    catch (e) {
        res.status(500).send({ error: 'Something failed! Error: ' + e });
    }
}


module.exports.join = function (req, res){
    const io = req.app.get('io')();
    const socketId  = req.body.socketId;
    const roomId  = req.body.roomId;
    const peerId  = req.body.peerId;

    const socket  = io.sockets.sockets.get(socketId);

    socket.join(roomId);

    socket.broadcast.to(roomId).emit('newUser', req.body);


    res.status(200).send(JSON.stringify({
        message: 'joined'
    }));

}




module.exports.leave = function (req, res){
    const io = req.app.get('io')();

    const socketId  = req.body.socketId;
    const roomId  = req.body.roomId;
    const socket  = io.sockets.sockets.get(socketId);
    socket.leave(roomId);

    res.status(200).send(JSON.stringify({
        message: 'Room has been leaved',
        result: true
    }));
}


module.exports.hasRoom = function (req, res){
    const io = req.app.get('io')();

    const rooms = Array.from(io.sockets.adapter.rooms, ([name, value]) => ({ name, value }));
    const isRoom = rooms.some((curr) => curr.name === req.body.roomId);

    if(isRoom){
        res.status(200).send(JSON.stringify({
            message: 'Room has already been created',
            result: true
        }));
    }
    else{
        res.status(200).send(JSON.stringify({
            message: 'Cannot find implementation of the room with this id',
            result: false
        }));
    }

}



//io.listen(3001);
