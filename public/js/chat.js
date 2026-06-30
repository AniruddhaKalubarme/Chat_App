const socket = io()

const ip = document.querySelector('#ip')
const msgSub = document.querySelector('#msgSub')
const form = document.querySelector('#msg-form')
const sendLocation = document.querySelector('#sendLocation')
const messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('Message', (strObj)=>{
    console.log(strObj)
    const html = Mustache.render(messageTemplate, {
        message:strObj.text,
        createdAt:moment(strObj.time).format('hh:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('sendLocationFromServer', (str)=>{
    console.log(str)
    const html = Mustache.render(locationTemplate, {
        location:str
    })
    messages.insertAdjacentHTML('beforeend', html)
})

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    msgSub.setAttribute('disabled', 'disabled')
    const message = ip.value
    if(message.trim() != "")
    {
        ip.value = ''
        socket.emit('sendMessage', message, (error)=>{
            if(error){
                console.error(error)
                return
            }

            console.log('Message delivered')
        })
    }
    else{
        alert('Empty message cannot be sent')
    }

    msgSub.removeAttribute('disabled')

})

sendLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolaction is not supported by your browser')
    }

    sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        coord = {
            lat:position.coords.latitude,
            lon:position.coords.longitude
        }

        socket.emit('sendLocationFromClient', coord, ()=>{
            console.log("Location shared");
            sendLocation.removeAttribute('disabled')
        })
    })
})