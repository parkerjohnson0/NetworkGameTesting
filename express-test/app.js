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
let scoresRoute = require('./routes/scoresRoute.js')
let guideRoute = require('./routes/guideRoute.js')
let gameRoute = require('./routes/gameRoute.js')


// let home = require('./routes/home.js')


let app = express()
app.cors = cors
app.db = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
app.db.Connect();
app.use(cors({
    origin: ["http://localhost:3001",
        "http://www.skelegame.com", 'http://www.skelegame.com/socket.io/'
    ]
}))
//MAY NEED OTHER BODYPARSER TYPES AT SOME POINT
app.use(bodyParser.json())
app.use('/scores', scoresRoute)
app.use('/guide', guideRoute)
app.use('/game', gameRoute)
app.set('view engine', 'ejs')
app.use(express.static('./public')) //this serves the homepage

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

app.get('/scores', scoresRoute)
app.get('/guide', guideRoute)
app.get('/game', gameRoute)



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
    let updateTimer = setInterval(sendToClient, INTERVAL, conn, client)
    conn.on("clientConnection", () =>
    {
        conn.emit("gameInstanceID", instance.uuid)
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
            // console.log(`new player '${name}' joined`)
            io.in(room).emit("greetPlayer", name)
        })
        conn.on("disconnect", () =>
        {
            clearInterval(updateTimer)
            removeClient(instance, client)
            removeInstanceIfEmpty(instance)
            // console.log("client disconnected:", client.socketID, "| Game Instance: ", instance.uuid);
            // conn.to(room).emit("playerDisconnected", conn.id)
            conn.to(room).emit("playerDisconnected", client.username)
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
            // console.log("REQUEST TO START")

            client.buildTimerRequested = true
            if (buildTimerCanStart(instance))
            {
                // client.joinedGame = true;
                if (!instance.gameInProgess)
                {
                    instance.gameInProgess = !instance.gameInProgess;
                }
                io.in(room).emit("buildTimerStart")
                instance.gameState = GameStates.BuildPhase
                // console.log("build timer start")
            }
            else if (instance.gameState == GameStates.PreGame) //when joined but waiting on other player to join or enter name
            {
                io.in(room).emit("waitingForPlayer");
                // client.joinedGame = true;
            }
            client.joinedGame = true;
        })
        conn.on("soloGameStart",callback), () =>
        {
            if (instance.gameInProgess)
            {
                conn.emit("adminMessage","Game is already started")
                callback({"response" : false})
                return;
            }

            conn.to(room).emit("requeue");
            callback({"response" : true})
            if (!instance.gameInProgess)
            {
                instance.gameInProgess = !instance.gameInProgess;
            }
            io.in(room).emit("buildTimerStart")
            instance.soloGame = true;
            instance.gameState = GameStates.BuildPhase
        })
        conn.on("requestBuildTimerEnd", () =>
        {
            // console.log("REQUEST TO END")
            client.buildTimerRequested = false
            if (!instance.clients.some(x => x.buildTimerRequested == true))
            {
                io.in(room).emit("buildTimerEnd")
                instance.gameState = GameStates.AttackPhase
                // console.log("build timer End")
            }
        })
        conn.on("clientMouseData", (message) =>
        {
            client.mouseData = message
        })
        conn.on("towerData", (data) =>
        {
            // console.log(data)

            if (instance.gameState !== GameStates.BuildPhase)
            {
                return
            }
            conn.to(room).emit("newTower", data)

        })
        conn.on("towerUpgrade", (data) =>
        {
            conn.to(room).emit("upgradeTower", data)
        })
        conn.on("towerDestroy", (data) =>
        {
            conn.to(room).emit("destroyTower", data)
        })
        conn.on("gameOver", (score, round) =>
        {
            // console.log("round " + round)
            if (instance.gameState.name !== GameStates.GameOver.name) // name property is just to approximate a type safe enum
            {
                // let names = instance.clients.map(x => { return x.username })
                let name = instance.clients.find(x => x.socketID === conn.id).username;
                // instance.gameState = GameStates.GameOver
                instance.gameResult.push({
                    "score": score,
                    "name": name,
                })
                // sendToMongo(score,names, instance.uuid)
            }
            if (instance.gameResult.length === instance.clients.length)
            {
                sendToMongo(instance.gameResult, instance.uuid, round)
                io.in(room).emit("gameResults", instance.gameResult, round)
            }
        })
    })

})

function removeInstanceIfEmpty(instance)
{
    if (instance.clients.length == 0)
    {
        // console.log("removing instance",instance.uuid)
        gameInstances = gameInstances.filter((x) => x != instance)
    }
}
function sendToMongo(result, uuid, wave)
{
    // let url = "http://localhost:3000/api/Players"
    // let url = "http://skelegame.com/api/Players"
    // let url = "http://localhost:3001/api/Players"

    // let url = "game.parkerjohnson-projects.com/api/Players"
    let data = { result, uuid, wave }
    // console.log(app.db.InsertDocument(data, "Leaderboard"))
    app.db.InsertDocument(data, "Leaderboard")
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
    return connectedClientsReady && (instance.clients.length > 1 || instance.soloGame)

}
function getRoom(client)
{

    sockets.push(client)
    console.log("new client connected: ", client.id)
    // let roomNumber = gameInstances.findIndex(x => x.clients.some(y => y.socketID == client.id))
    let roomNumber = gameInstances.find(x => x.clients.some(y => y.socketID == client.id)).uuid
    return "room" + roomNumber
}
function removeClient(instance, client)
{
    instance.clients = instance.clients.filter(x => x.socketID != client.socketID)
}
function enqueue(conn)
{
    let clientAdded = AddClientToGame(conn)

    if (!clientAdded)
    {
        gameInstances.push(new GameInstance())
        // console.log(gameInstances)
        AddClientToGame(conn)
    }
}
function AddClientToGame(conn)
{
    if (gameInstances.length == 0)
    {
        gameInstances.push(new GameInstance())
        // console.log(gameInstances)
    }
    let clientAdded = false
    gameInstances.forEach(element =>
    {
        if (element.clients.length < 2 && !element.gameInProgess)
        {
            element.addClient(conn.id)
            // console.log("client added to instance: " + element.uuid)
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
function sendToClient(conn, client)
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

                if (x.joinedGame) //only send data if connected player has joined the game
                {
                    clientData.push(x.playerData)
                    mouseData.push(x.mouseData)
                }

            })
            let room = conn.rooms
            if (clientData && mouseData && clientData.length > 0 && mouseData.length > 0)
            {

                room = [...room][1]//i dont understand this. something called spread syntax?
                // conn.emit("playerData", JSON.stringify(clientData))
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
        this.gameInProgess = false;
        this.gameResult = [];
        this.soloGame = false;
        // console.log('adding instance:' + this.uuid);
    }
    addClient(id, username)
    {
        this.clients.push(new Client(id, this.uuid, username))
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
    constructor(socketID, gameID, username)
    {
        this.gameID = gameID
        this.socketID = socketID
        this.playerData = {},
            this.mouseData = {},
            this.username = username,
            this.buildTimerRequested = false,
            this.joinedGame = false
    }
}