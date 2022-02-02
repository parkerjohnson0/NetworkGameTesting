let CANVAS_WIDTH = 1000;
let CANVAS_HEIGHT = 580;
// let socket = io("ws://64.53.36.163:60003")
let socket
let socketID //save ID so that client player can be retrieved from playerslist after a disconnect. band aid for bad design decision right now
let canv
let playerName = "player"
let playersList = []
let chatBox
let up = false, down = false, left = false, right = false
let gameAreaWidth = 700
let chatBoxWidth = 300
function setup()
{
    chatBox = new ChatBox(700,0,chatBoxWidth,580)
    chatBox.input.elt.addEventListener("keydown", inputListener)
    chatBox.button.elt.addEventListener("click", chatListener)
    console.log(document.cookie)
    checkCookieForLogin()
    frameRate(60)
    canv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canv.parent("game_container")
    createClientPlayer()
    setupSocket();

}
function draw()
{
    background(30)
    updatePlayers()
    chatBox.show()
}

function checkCookieForLogin()
{   
    //delete cookie for testing purposes
    document.cookie = document.cookie + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    let cookie = document.cookie;
    if (!getPlayerName(cookie))
    {
        promptForName() 
        
    }
}
function getPlayerName(cookie){
    let cookies = cookie.split(";")
    for (let i = 0; i < cookies.length; i++)
    {
        let nameValue = cookies[i].split("=")
        if (nameValue[0].trim() == "name")
        {
            playerName = nameValue[1]
            return true
        }
    }
    return false
}

function promptForName()
{
    let nameBox= select("#name_box_container")
    nameBox.elt.style.visibility = "visible"
    nameBox.elt.addEventListener("keydown",nameBoxListener)
}
function nameBoxListener(e)
{
    switch (e.key)
    {
        case "Enter":
            let name = select("#name_text").elt.value.trim();
            // let nums = new Uint32Array(1)
            if (name && name != "")
            {
                document.cookie = "name=" + name
                playerName = name
                this.style.visibility = "hidden"
            }
            break;
        default:
            break;
    }
}
function SendToMongo(uuid,name)
{
    let url = "http://localhost:3000/api/Players"
    // let url = "game.parkerjohnson-projects.com/api/Players"
    let data = {userId: uuid, name: name}
    httpPost(url, "json", data,
        function (result)
        {   
            console.log(result)
        }),
        function (error)
        {
            console.log(error)
        }
        

}
function userExists(cookie)
{
    return cookie.split(":")
        .any(x => x.startsWith("name:"))
  
}
function chatListener(e)
{
    sendMessage()
}
function inputListener(e)
{
    switch (e.key)
    {
        case "Enter":
            sendMessage()
            break;
        default:
            chatBox.input.html(e,true)
            break;
    }
}
function sendMessage()
{
    let text = chatBox.input.elt.value;
    chatBox.input.elt.value = "" //reset input 
    let string = `${playerName}: ${text}`
    chatBox.addChatMessage(string)
    socket.emit("chatMessage", string)
}

function updatePlayers()
{
    updateClient()
    updateConnectedPlayers()
    sendClientState()
}
function sendClientState()
{

    if (socket && socket.connected)
    {
        let client = playersList.find(x => x.id == socketID|| x.id == 0)
        let clientJSON = JSON.stringify(client)
        socket.emit("clientData", clientJSON)
        // console.log(clientJSON)

    }
}
function updateConnectedPlayers()
{
    socket.emit("requestUpdate")
    if (playersList.length > 1)
    {
        let connectedPlayers = playersList.filter(x => x.id != socketID)
        for (let i = 0; i < connectedPlayers.length; i++)
        {
            fill(255)
            circle(connectedPlayers[i].x, connectedPlayers[i].y, 20)
        }

    }
}
function updateClient()
{
    let player = playersList.find(x => (x.id == 0 || x.id == socketID))

    if (up)
    {
        player.y -= deltaTime;
    }
    if (down)
    {
        player.y += deltaTime;
    }
    if (left)
    {
        player.x -= deltaTime;
    }
    if (right)
    {
        player.x += deltaTime;
    }
    fill(255)
    circle(player.x, player.y, 20)
}
function keyReleased()
{
    switch (key)
    {
        case "w":
            up = false;
            break;
        case "a":
            left = false;
            break;
        case "s":
            down = false;
            break;
        case "d":
            right = false;
            break;
    }
}
function keyPressed()
{
    switch (key)
    {
        case "w":
            up = true;
            break;
        case "a":
            left = true;
            break;
        case "s":
            down = true;
            break;
        case "d":
            right = true;
            break;
    }
}
function createClientPlayer()
{
    clientPlayer = new Player(Math.random() * 200 + 200, Math.random() * 400 + 100)
    playersList.push(clientPlayer);
}
function setupSocket()
{
    // socket = io('localhost:60003')
    socket = io("wss://www.skelegame.com:60003")

    socket.on("connect", () =>
    {
        socket.emit("clientConnection")
        playersList.find(x => x.id == 0).id = socket.id
        socketID = socket.id

    })
    socket.on("newChatMessage", (data) =>
    {
        chatBox.addChatMessage(data)
    })
    //listen for incoming player data
    socket.on("playerData", (data) =>
    {
        let playerData = JSON.parse(data)

        //change this or disconnecting will be a pain
        for (let i = 0; i < playerData.length; i++)
        {
            let updatePlayer = playersList.find(x => x.id == playerData[i].id)
            let index = playersList.indexOf(updatePlayer)
            if (index > -1)
            {
                playersList[index] = playerData[i]
            }
            else
            {
                playersList.push(playerData[i])
            }
        }
    })
    socket.on("playerDisconnected", (playerId) =>
    {
        let deletePlayer = playersList.find(x => x.id == playerId)
        let index = playersList.indexOf(deletePlayer)
        playersList.splice(index, 1)
        console.log("player with id :" + playerId + " has been removed.")

    })
}

class Player
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
        this.id = 0
    }
}
class ChatMessage
{
    constructor(name, text)
    {
        this.name = name;
        this.text = text;
    }
}

