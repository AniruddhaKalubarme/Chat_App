const socket = io()

socket.on('Message', (str)=>{
    console.log(str)
})

const ip = document.querySelector('#ip')
const msgSub = document.querySelector('#msgSub')
const form = document.querySelector('#msg-form')
const sendLocation = document.querySelector('#sendLocation')

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = e.target.elements.ip.value
    // console.log('message')
    if(message.trim() != "")
    {
        socket.emit('sendMessage', message)
    }
})

sendLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolaction is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        coord = {
            lat:position.coords.latitude,
            lon:position.coords.longitude
        }

        socket.emit('sendLocation', coord)
    })
})