const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('../src/utils/generateMessage')
app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log("New WebSocket Connection")
    socket.emit('Message', generateMessage("Welcome to the Panel"))
    socket.broadcast.emit("Message", generateMessage('A new user has joined'))

    socket.on('sendMessage', (msg, callback)=>{
        // console.log("message received: ", msg)
        const filter = new Filter()

        if(filter.isProfane(msg))
        {
            return callback('Shivya deu naka!')
        }

        io.emit('Message', msg)
        callback()
    })

    socket.on('sendLocationFromClient', (coord, callback)=>{
        io.emit('sendLocationFromServer', `https://google.com/maps?q=${coord.lat},${coord.lon}`)
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('Message', generateMessage('A user has left'))
    })
})

server.listen(port, ()=>{
    console.log(`Server is set on port ${port}`)
})
