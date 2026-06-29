const socket = io()

socket.on('Message', (str)=>{
    console.log(str)
})

const ip = document.querySelector('#ip')
const msgSub = document.querySelector('#msgSub')
const form = document.querySelector('#msg-form')

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = e.target.elements.ip.value
    // console.log('message')
    if(message.trim() != "")
    {
        socket.emit('sendMessage', message)
    }
})