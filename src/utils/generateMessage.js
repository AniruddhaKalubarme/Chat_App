const generateMessage = (user, msg)=>{
    return {
        user,
        text: msg,
        time: new Date().getTime()
    }
}

module.exports = {generateMessage}