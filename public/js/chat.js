const socket = io()

socket.on('countUpdated', (iCnt)=>{
    console.log('The count has been updated!', iCnt)
})

const increament = document.querySelector('#increament')

increament.addEventListener('click', ()=>{
    console.log('Clicked')
    // console.clear()
    socket.emit('increament')
})