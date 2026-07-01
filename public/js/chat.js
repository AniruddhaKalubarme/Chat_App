const socket = io()

const ip = document.querySelector('#ip')
const msgSub = document.querySelector('#msgSub')
const form = document.querySelector('#msg-form')
const sendLocation = document.querySelector('#sendLocation')
const messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

const {userName, roomName} = Qs.parse(location.search, {ignoreQueryPrefix: true})
const currentUser = (userName || '').trim().toLowerCase()

const isOwnMessage = (sender) => sender && sender.trim().toLowerCase() === currentUser

socket.on('Message', (strObj)=>{
    // console.log('strobj is: ',strObj)
    const html = Mustache.render(messageTemplate, {
        user: strObj.user,
        message:strObj.text,
        createdAt:moment(strObj.time).format('hh:mm a'),
        isOwn: isOwnMessage(strObj.user)
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('sendLocationFromServer', (locObj)=>{
    // console.log(locObj)
    const html = Mustache.render(locationTemplate, {
        user: locObj.user,
        location:locObj.text,
        createdAt:moment(locObj.time).format('hh:mm a'),
        isOwn: isOwnMessage(locObj.user)
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
        const coord = {
            lat:position.coords.latitude,
            lon:position.coords.longitude
        }

        socket.emit('sendLocationFromClient', coord, ()=>{
            console.log("Location shared");
            sendLocation.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {userName, roomName}, (error) => {
    if(error)
    {
        alert(error)
        location.href = '/'
    }    
})