const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/generateMessage')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log("New WebSocket Connection")
    

    socket.on('join', ({userName, roomName}, callback) => {
        const user = addUser({id: socket.id, userName, roomName})

        if(user.error)
            return callback(user.error)
        
        socket.join(user.roomName)
        socket.emit('Message', generateMessage('System', "Welcome to the Panel"))
        socket.broadcast.to(user.roomName).emit("Message", generateMessage('System', `${user.userName} has Joined the Room!`))
        
        io.to(user.roomName).emit('roomData', {
            roomName: user.roomName,
            users: getUsersInRoom(user.roomName)
        })

        callback()
    })

    socket.on('sendMessage', (msg, callback)=>{
        // console.log("message received: ", msg)
        const filter = new Filter()
        const user = getUser(socket.id)

        if(!user)
        {
            return callback('User not found')
        }

        if(filter.isProfane(msg))
        {
            return callback('Shivya deu naka!')
        }
        
        io.to(user.roomName).emit('Message', generateMessage(user.userName, msg))
        callback()
    })

    socket.on('sendLocationFromClient', (coord, callback)=>{
        const user = getUser(socket.id)
        if(!user)
        {
            return callback('User not found')
        }

        io.to(user.roomName).emit('sendLocationFromServer', generateMessage(user.userName, `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user)
        {
            io.to(user.roomName).emit('Message', generateMessage('System', `${user.userName} has left!`))
            io.to(user.roomName).emit('roomData', {
                roomName: user.roomName,
                users: getUsersInRoom(user.roomName)
            })
        }
    })
})

server.listen(port, ()=>{
    console.log(`Server is set on port ${port}`)
})
