const Queue = require('./Queue');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { connected, sourceMapsEnabled } = require('process');
const cors = require("cors");

const PORT = process.env.PORT || 5500;
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketIo(server); 
app.use(express.static('public'));

var loop;
const allPlayers = {}
var playerCounter = 0
const queue = new Queue()

const colors = {
    cblack: 'colorBlack',
    cwhite : 'colorWhite',
}

io.on('connection', (socket)=>{
    console.log('client connected: ', socket.id);
    allPlayers[socket.id] = {socketid:socket.id , name:'' , opponentsocketid:null}
    playerCounter++

    console.log(playerCounter)
    console.log(queue.size())

    socket.on('search',(playername)=>{
        allPlayers[socket.id].name = playername
        queue.enqueue(allPlayers[socket.id])
        if(queue.size() >= 2){
            loop = setInterval(match , 100)
        }
    })
    socket.on('disconnect',(reason)=>{
        console.log(reason)
        playerCounter--
        delete allPlayers[socket.id]
        if(playerCounter < 2){
            clearInterval(loop)
        }
    })
    socket.on('message-sent',(data)=>{
      io.to(allPlayers[socket.id].opponentsocketid).emit('message-recive',data)
    })
    socket.on('movepiece',(data)=>{
      io.to(allPlayers[socket.id].opponentsocketid).emit('switchturn',data)
    })
    socket.on('leave-match' ,()=>{
      
    })
})

server.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log('Server running on Port ', PORT);
  });


  function match(){
    const player1 = queue.dequeue()
    if(allPlayers[player1.socketid] == undefined) return

    const player2 = queue.dequeue()
    if(allPlayers[player2.socketid] == undefined){
      queue.enqueue(player1)
      return
    }
    // match found
    player1.opponentsocketid = player2.socketid
    player2.opponentsocketid = player1.socketid

    io.to(player1.socketid).emit('matchfound',{main:player1,opponent:player2 ,color: colors.cwhite})
    io.to(player2.socketid).emit('matchfound',{main:player2,opponent:player1 , color:colors.cblack})

    if(queue.size() < 2){
      clearInterval(loop)
      loop = null
    }
  }
