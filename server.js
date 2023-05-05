const express = require('express')
const app = express()
app.use(express.static(__dirname+'/public')) //**********************CONVERT EJS TO HTML AND USE DIRNAME */

// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
 
var roomId=uuidV4//ADDED THISSSSSSSSS

app.use('/peerjs', peerServer);


//app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  //res.redirect(`/${uuidV4()}`)
  res.send("hii");
  app.use(express.static(__dirname+'/public'));
})

//app.get('/:room', (req, res) => {
//  res.render('room', { roomId: req.params.room })
//})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3030||process.env.PORT)
      