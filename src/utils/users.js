const users = []

const addUser = ({id, userName, roomName}) => {
    userName = userName.trim().toLowerCase()
    roomName = roomName.trim().toLowerCase()

    if(!userName || !roomName){
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.roomName === roomName && user.userName === userName
    })

    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    const user = {id:id, userName:userName, roomName:roomName}
    users.push(user)
    return user
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1)
    {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.roomName === room)
}

// addUser({id: 27, userName: 'Aniruddha', roomName: 'TE-B'})
// addUser({id: 35, userName: 'shiv', roomName: 'TE-C'})
// addUser({id: 35, userName: 'pratap', roomName: 'TE-C'})
// addUser({id: 35, userName: '', roomName: ''})
// addUser({id: 65, userName: 'niraj', roomName: 'TE-A'})
// addUser({id: 65, userName: 'niraj', roomName: ''})

// console.log(users)

// removeUser(35)

// console.log(users)

// const user = getUser(27)
// console.log(user)

// const userList = getUsersInRoom('te-c')
// console.log(userList)

module.exports = {addUser, removeUser, getUser, getUsersInRoom}