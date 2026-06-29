const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')

app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=>{
    console.log("New WebSocket Connection")
    socket.emit('Message', "Welcome to the Panel")

    socket.on('sendMessage', (msg)=>{
        console.log("message received: ", msg)
        io.emit('Message', msg)
    })
})

server.listen(port, ()=>{
    console.log(`Server is set on port ${port}`)
})
