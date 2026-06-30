const generateMessage = (msg)=>{
    return {
        text: msg,
        time: new Date().getTime()
    }
}

module.exports = {generateMessage}