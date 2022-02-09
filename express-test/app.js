require('dotenv').config()
let crypto = require('crypto')
require('./server/SocketIO.js')

let cors = require('cors')
// let corsOptions = {
//     origin: ['https://localhost:5500', 'http:game.parkerjohnson-projects.com'],
//     optionsSuccesStatus : 200
// }
let MongoDB = require('./database/MongoDB.js')
// let MongoDB = require('./database/MongoDB.js')
let express = require('express')
//how different would it be without body-parser
let bodyParser = require('body-parser')
let players = require('./routes/players.js')
let scores = require('./routes/scores.js')

let home = require('./routes/home.js')
let app = express()
app.cors = cors
app.db = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
app.db.Connect();
app.use(cors({
    origin: ["http://localhost:3001",
        "http://www.skelegame.com",'http://www.skelegame.com/socket.io/'
    ]
}))
//MAY NEED OTHER BODYPARSER TYPES AT SOME POINT
app.use(bodyParser.json())
app.use(express.static('./public')) //this servers the homepage
app.use('/api/Players', players)
app.use('/api/Scores', scores)

// app.use('/', home)

const port = 3001
// let connection = `mongodb+srv://parker:Hcystydm%239@cluster0.hoegu.mongodb.net/499Game?retryWrites=true&w=majority`
// const mongo = new MongoDB(connection, "499Game")
// mongo.Connect()
// app.get('/api/Players',(req,res)=>{

// })
// app.post('/api/Players', (req,res)=>{
//     let player = req.body
//     mongo.InsertDocument(player,"Players")
// })
let server = app.listen(port, () =>
{
    console.log(`listening on port ${port}`)
})
let io = require('socket.io')(server)
// // import { Server } from 'socket.io'
// let Server = require('socket.io')
// // import crypto from 'crypto'
// let crypto = require('crypto')
// // import { io } from 'socket.io-client'
// let io = require('socket.io-client')

// const server = Server(60003, {
//     cors: {
//         origin: ['http://127.0.0.1:5500', 'http://chat.parkerjohnson-projects.com', 'http://game.parkerjohnson-projects.com',
//             'http://localhost:3001',"http://www.skelegame.com","http://www.skelegame.com/socket"
//         ]
//     }
// })
let gameInstances = []
let playerNames = []
let sockets = []
let updateClients = false
//probably need to discard buffer on reconnection. research socket.io volatile
io.on("connection", (conn) =>
{
    //add some cache mechanism maybe? dont know if would be that useful. 
    let client = conn
    enqueue(client) //place client in game instance
    let room = getRoom(client)
    let instance = gameInstances.find(x => x.clients.some(y => y.socketID == conn.id))
    client.join(room)
    //this 
    conn.on("clientConnection", () =>
    {
        client.emit("gameInstanceID",instance.uuid)
        // enqueue(client)
        // sockets.push(client)
        // console.log("new client connected: ", client.id)
        // let room = conn.rooms
        // room = [...room][1]//i dont understand this. something called spread syntax?

        client.on("clientData", (clientJSON) =>
        {

            // updateClients = true
            updateClientData(JSON.parse(clientJSON))

        })
        client.on("chatMessage", (message) =>
        {
            instance.chatMessages.push(message)
            let room = conn.rooms
            room = [...room][1]
            client.to(room).emit("newChatMessage", message);
        })
        client.on("newPlayerJoined", (name) =>
        {
            let client = instance.clients.filter(x => x.socketID == conn.id)
            client.username = name
            console.log(`new player '${name}' joined`)
            io.in(room).emit("greetPlayer", name)
        })
        client.on("disconnect", () =>
        {
            let disconnectSock = sockets.find(x => x == client)
            sockets = sockets.filter(x => x != disconnectSock)
            removeClient(instance, disconnectSock)
            removeInstanceIfEmpty(instance)
            client.to(room).emit("playerDisconnected", client.id)
            console.log("client disconnected:", disconnectSock.id)
        })
        client.on("requestUpdate", () =>
        {
            // console.log(gameInstances.map((x) =>
            // {
            //     return x.uuid
            // }))
            // if (updateClients)
            // {
                sendToClient(client)
                // updateClients = false
            // }
        })
        client.on("requestBuildTimerStart", () =>
        {
            // console.log("build timer requested by client", client.id, "in room", room) 
            let client = instance.clients.find(x => x.socketID == conn.id)
            client.buildTimerRequested = true
            if (buildTimerCanStart(instance))
            {
                io.in(room).emit("buildTimerStart")
                console.log("build timer start")
            }
        })
        client.on("requestBuildTimerEnd", () =>
        {
            let client = instance.clients.find(x => x.socketID == conn.id)
            client.buildTimerRequested = false
            if (!instance.clients.some(x => x.buildTimerRequested == true))
            {
                io.in(room).emit("buildTimerEnd")
                console.log("build timer End")
            }
        })
        client.on("clientMouseData", (message) =>
        {
            let client = instance.clients.find(x => x.socketID == conn.id)
            client.mouseData = message

        })
        client.on("towerData", () =>
        {
            
        })
        client.on("saveScore", (score,playerName) =>
        {
            sendToMongo(score,playerName, instance.uuid)
        })
    })

})
function removeInstanceIfEmpty(instance)
{
    if (instance.clients.length == 0)
    {
        console.log("removing instance")
        gameInstances = gameInstances.filter((x) => x != instance)
    }
}
function sendToMongo(score,name,uuid)
{
    // let url = "http://localhost:3000/api/Players"
    // let url = "http://skelegame.com/api/Players"
    // let url = "http://localhost:3001/api/Players"
    
    // let url = "game.parkerjohnson-projects.com/api/Players"
    let data = { score: score, name: name,uuid}
    console.log(app.db.InsertDocument(data, "Scores"))
    // httpPost(url, "json", data,
    //     function (result)
    //     {   
    //         console.log(result)
    //     }),
    //     function (error)
    //     {
    //         console.log(error)
    //     }
        

}
function buildTimerCanStart(instance)
{
    let connectedClientsReady = !instance.clients.some(x => x.buildTimerRequested == false)
    return connectedClientsReady && instance.clients.length > 1
    
}
function getRoom(client)
{
    
    sockets.push(client)
    console.log("new client connected: ", client.id)
    let roomNumber = gameInstances.findIndex(x => x.clients.some(y => y.socketID == client.id))
    return "room" + roomNumber
}
function removeClient(instance,disconnectSock)
{
    instance.clients.filter(x => x.socketID != disconnectSock.id)
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
            return true
        }
        return false
    });
    return clientAdded
}
// setInterval(update, 16)
// function update()
// {

// }
function sendToClient(conn)
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

        if (clientSockets)
        {
            let clientData
            clientSockets.forEach(socket =>
            {

                clientData = instance.clients.filter(x => x.socketID != socket.id).map((client) =>
                {
                    return client.playerData

                })
                mouseData = instance.clients.filter(x => x.socketID != socket.id).map((client) =>
                {
                    return client.mouseData

                })


            })
            let room = conn.rooms
            if (clientData && clientData.length > 0)
            {

                room = [...room][1]//i dont understand this. something called spread syntax?
                conn.in(room).emit("playerData", JSON.stringify(clientData))
                conn.in(room).emit("serverMouseData", mouseData)
            }
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

    let updateClient = gameInstance.clients.find(x => x.socketID == newData.id)
    updateClient.playerData = newData

}

class GameInstance
{
    constructor()
    {
        this.clients = []
        this.uuid = crypto.randomUUID()
        this.chatMessages = []
    }
    addClient(id,username)
    {
        this.clients.push(new Client(id, this.uuid,username))
    }
    updateClient(client)
    {
        let target = this.clients.filter(x => x.id === client.id)
        target = client
    }
}
class Client
{
    constructor(socketID, gameID,username)
    {
        this.gameID = gameID
        this.socketID = socketID
        this.playerData = {},
        this.mouseData = {},
        this.username = username,
        this.buildTimerRequested = false
    }
}