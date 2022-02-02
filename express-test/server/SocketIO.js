// import { Server } from 'socket.io'
let Server = require('socket.io')
// import crypto from 'crypto'
let crypto = require('crypto')
// import { io } from 'socket.io-client'
let io = require('socket.io-client')

const server = Server(60003, {
    cors: {
        origin: ['http://127.0.0.1:5500', 'http://chat.parkerjohnson-projects.com', 'http://game.parkerjohnson-projects.com',
            'http://localhost:3000',"https://www.skelegame.com","http://www.skelegame.com"
        ]
    }
})
let gameInstances = []

let playerData = []
let sockets = []
let updateClients = false
//probably need to discard buffer on reconnection. research socket.io volatile
server.on("connection", (conn) =>
{

    let client = conn
    client.join(JoinRoom(client))
    //this 
    conn.on("clientConnection", () =>
    {
        // enqueue(client)
        // sockets.push(client)
        // console.log("new client connected: ", client.id)
        let room = conn.rooms
        room = [...room][1]//i dont understand this. something called spread syntax?

        client.on("clientData", (clientJSON) =>
        {

            updateClients = true
            updateClientData(JSON.parse(clientJSON))

        })
        client.on("chatMessage", (message) =>
        {
            let gameInstance = gameInstances.find(x => x.clients.some(y => y.socketID == conn.id))
            gameInstance.chatMessages.push(message)
            let room = conn.rooms
            room = [...room][1]
            client.to(room).emit("newChatMessage", message);
        })
        client.on("disconnect", () =>
        {
            let disconnectSock = sockets.find(x => x == client)
            sockets = sockets.filter(x => x != disconnectSock)
            RemoveClient(disconnectSock)
            client.to(room).emit("playerDisconnected", client.id)
            console.log("client disconnected:", disconnectSock.id)
        })
        client.on("requestUpdate", () =>
        {
            if (updateClients)
            {
                sendToClients(client)
                updateClients = false
            }
        })
        client.on("buildTimerStart", () =>
        {
            
        })
    })

})
function JoinRoom(client)
{
    enqueue(client)
    sockets.push(client)
    console.log("new client connected: ", client.id)
    let roomNumber = gameInstances.findIndex(x => x.clients.some(y => y.socketID == client.id))
    return "room" + roomNumber
}
function RemoveClient(disconnectSock)
{
    gameInstances.forEach((x) =>
    {
        x.clients = x.clients.filter(x => x.socketID != disconnectSock.id)
    })
}
function enqueue(conn)
{
    let clientAdded = AddClientToGame(conn)

    if (!clientAdded)
    {
        gameInstances.push(new GameInstance())
        AddClientToGame(conn)
    }
}
function AddClientToGame(conn)
{
    if (gameInstances.length == 0)
    {
        gameInstances.push(new GameInstance())
    }
    let clientAdded = false
    gameInstances.forEach(element =>
    {
        if (element.clients.length < 2)
        {
            element.addClient(conn.id)
            clientAdded = true
        }
    });
    return clientAdded
}
// setInterval(update, 16)
// function update()
// {
//     if (updateClients)
//     {
//         sendToClients()
//         updateClients = false
//     }
// }
function sendToClients(conn)
{
    //for each socket. get matching client. then get client data from
    //matching game instance
    let clientSockets = []
    let instance = gameInstances.find(x => x.clients.some(x => x.socketID == conn.id))
    if (!instance)
    {
        console.log("instance null")
    }
    if (instance)
    {

        instance.clients.filter(x => x.socketID != conn.id).forEach(client =>
        {
            clientSockets.push(sockets[sockets.findIndex(x => x.id == client.socketID)])
        });
        // gameInstances.forEach((game) =>
        // {
        //     let client = game.clients.find(x => x.socketID == conn.id)
        //     if (client)
        //     {
        //         clientSockets.push(sockets[sockets.findIndex(x => x.id == client.socketID)])
        //     }
        // })
        if (clientSockets)
        {
            clientSockets.forEach(socket =>
            {
                // let client
                // gameInstances.forEach((game) =>
                // {
                //     client = game.clients.find(x => x.socketID == socket.id)
                //     if (client)
                //     {
                //         return;
                //     }
                // })
                // if (client)
                // {
                let gameInstance = gameInstances.find(x => x.clients.some(y => y.socketID == socket.id))
                let clientData = gameInstance.clients.filter(x => x.socketID != socket.id).map((client) =>
                {
                    return client.data

                })
                // console.log(clientData)
                // socket.emit("playerData", JSON.stringify(clientData))
                let room = conn.rooms
                if (clientData.length > 0)
                {

                    room = [...room][1]//i dont understand this. something called spread syntax?
                    conn.in(room).emit("playerData", JSON.stringify(clientData))
                    console.log("SENDING: ", JSON.stringify(clientData))
                }
                // }
            })
        }
    }

}
function updateClientData(newData)
{
    let oldData
    let gameInstance = gameInstances.find(x =>
    {
        return x.clients.some(y => y.socketID == newData.id)
    })
    // gameInstances.forEach(element =>
    // {
    //     if (element.clients.find(x => x.socketID === newData.id))
    //     {

    //     }
    // });
    let updateClient = gameInstance.clients.find(x => x.socketID == newData.id)
    updateClient.data = newData
    // gameInstances.forEach((element) =>
    // {
    //     if (oldData = element.clients.find(x => x.socketID === newData.id))
    //     {
    //         let indexOfClient = element.clients.indexOf(oldData)
    //         element.clients[indexOfClient].data = newData
    //     }
    // })
    //try switch filter to find
    // if (playerData.length == 0 || !playerData.filter(x => x.id == client.id)[0]) 
    // {
    //     playerData.push(client)
    //     console.log(client)
    // }
    // else
    // {
    //     let prevClientData = playerData.filter(x => x.id === client.id)[0]
    //     let indexOfClient = playerData.indexOf(prevClientData)
    //     playerData[indexOfClient] = client
    // }
}

class GameInstance
{
    constructor()
    {
        this.clients = []
        this.uuid = crypto.randomUUID()
        this.chatMessages = []
    }
    addClient(id)
    {
        this.clients.push(new Client(id, this.uuid))
    }
    updateClient(client)
    {
        let target = this.clients.filter(x => x.id === client.id)
        target = client
    }
}
class Client
{
    constructor(socketID, gameID)
    {
        this.gameID = gameID
        this.socketID = socketID
        this.data = {}

    }
}

module.exports = server;