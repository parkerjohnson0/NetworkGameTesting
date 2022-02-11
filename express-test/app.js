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
let leaderboard = require('./routes/leaderboard.js')

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
app.use('leaderboard', leaderboard)


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
app.get('/leaderboard',leaderboard)
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
const INTERVAL = 1000 / 30
//probably need to discard buffer on reconnection. research socket.io volatile
io.on("connection", (conn) =>
{
    //add some cache mechanism maybe? dont know if would be that useful. 
    enqueue(conn) //place client in game instance
    let room = getRoom(conn)
    conn.join(room)
    let instance = gameInstances.find(x => x.clients.some(y => y.socketID == conn.id))
    let client = instance.clients.find(x => x.socketID == conn.id)
    //this 
    let updateTimer = setInterval(sendToClient,INTERVAL,conn)
    conn.on("clientConnection", () =>
    {
        conn.emit("gameInstanceID",instance.uuid)
        // enqueue(client)
        // sockets.push(client)
        // console.log("new client connected: ", client.id)
        // let room = conn.rooms
        // room = [...room][1]//i dont understand this. something called spread syntax?

        conn.on("clientData", (clientJSON) =>
        {

            // updateClients = true
            updateClientData(JSON.parse(clientJSON))

        })
        conn.on("chatMessage", (message) =>
        {
            instance.chatMessages.push(message)
            let room = conn.rooms
            room = [...room][1]
            conn.to(room).emit("newChatMessage", message);
        })
        conn.on("newPlayerJoined", (name) =>
        {
            client.username = name
            console.log(`new player '${name}' joined`)
            io.in(room).emit("greetPlayer", name)
        })
        conn.on("disconnect", () =>
        {   
            clearInterval(updateTimer)
            removeClient(instance, client)
            removeInstanceIfEmpty(instance)
            console.log("client disconnected:", client.socketID)
            conn.to(room).emit("playerDisconnected", conn.id)
        })
        // conn.on("requestUpdate", () =>
        // {
        //     // console.log(gameInstances.map((x) =>
        //     // {
        //     //     return x.uuid
        //     // }))
        //     // if (updateClients)
        //     // {
        //         sendToClient(conn)
        //         // updateClients = false
        //     // }
        // })
        conn.on("requestBuildTimerStart", () =>
        {
            // console.log("build timer requested by client", client.id, "in room", room) 
            client.buildTimerRequested = true
            if (buildTimerCanStart(instance))
            {
                io.in(room).emit("buildTimerStart")
                instance.gameState = GameStates.BuildPhase
                console.log("build timer start")
            }
        })
        conn.on("requestBuildTimerEnd", () =>
        {
            client.buildTimerRequested = false
            if (!instance.clients.some(x => x.buildTimerRequested == true))
            {
                io.in(room).emit("buildTimerEnd")
                instance.gameState = GameStates.AttackPhase
                console.log("build timer End")
            }
        })
        conn.on("clientMouseData", (message) =>
        {
            client.mouseData = message
        })
        conn.on("towerData", () =>
        {
            if (instance.gameState !== GameStates.BuildPhase)
            {
                return
            }
            
        })
        conn.on("gameOver", (score) =>
        {
            if (instance.gameState.name !== GameStates.GameOver.name)
            {
                let names = instance.clients.map(x => { return x.username })
                instance.gameState = GameStates.GameOver
                sendToMongo(score,names, instance.uuid)
                
            }
        })
    })

})
function removeInstanceIfEmpty(instance)
{
    if (instance.clients.length == 0)
    {
        console.log("removing instance",instance.uuid)
        gameInstances = gameInstances.filter((x) => x != instance)
    }
}
function sendToMongo(score,names,uuid)
{
    // let url = "http://localhost:3000/api/Players"
    // let url = "http://skelegame.com/api/Players"
    // let url = "http://localhost:3001/api/Players"
    
    // let url = "game.parkerjohnson-projects.com/api/Players"
    let data = {score, names,uuid}
    console.log(app.db.InsertDocument(data, "Leaderboard"))
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
function removeClient(instance,client)
{
    instance.clients = instance.clients.filter(x => x.socketID != client.socketID)
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
    // let clientSockets = []
    if (!conn) return
    let instance = gameInstances.find(x => x.clients.some(x => x.socketID == conn.id))
    if (!instance)
    {
        console.log("instance null")
    }
    if (instance)
    {

        // instance.clients.filter(x => x.socketID != conn.id).forEach(client =>
        // {
        //     clientSockets.push(sockets[sockets.findIndex(x => x.id == client.socketID)])
        // });
        let connectedPlayers = instance.clients.filter(x => x.socketID != conn.id)
        if (connectedPlayers)
        {
            let clientData = []
            let mouseData = []
            connectedPlayers.forEach(x =>
            {

                    
                clientData.push(x.playerData)
                mouseData.push(x.mouseData)
            })
            let room = conn.rooms
            if (clientData && mouseData && clientData.length > 0 && mouseData.length > 0)
            {

                room = [...room][1]//i dont understand this. something called spread syntax?
                conn.emit("playerData", JSON.stringify(clientData))
                conn.emit("serverMouseData", mouseData)
                // console.log("sending data to ", conn.id, clientData, mouseData)
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
        this.gameState = GameStates.PreGame

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
class GameStates
{
    static PreGame = new GameStates("PreGame")
    static BuildPhase = new GameStates("BuildPhase")
    static AttackPhase = new GameStates("AttackPhase")
    static GameOver = new GameStates("GameOver")
    constructor(name)
    {
        this.name = name
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