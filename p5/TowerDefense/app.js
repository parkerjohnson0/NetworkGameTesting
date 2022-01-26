let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;
// let socket = io("ws://64.53.36.163:60003")
let socket
let canv
let chatInput
let chatMessages
let playerName = ""
let playersList = []
let up = false, down = false, left = false, right = false
function setup()
{
    console.log(document.cookie)
    checkCookieForLogin()
    frameRate(60)
    canv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    chatMessages = select(".chat_messages")
    canv.parent("game_container")
    chatInput = select(".chat_input")
    chatInput.elt.addEventListener("keydown", inputListener)
    createClientPlayer()
    setupSocket();

    // testChatMessages()
}
// function testChatMessages()
// {
//     for (var i = 0; i < 5; i++)
//     {
//         addChatMessage("message number " + i)
//     }
// }
function checkCookieForLogin()
{
    let cookie = document.cookie;
    let uuid = cookie.split(":")[1]
    if (uuid)
    {
        getPlayerName(uuid);
    }
    else
    {
        promptForName() 
    }
}
function getPlayerName(uuid)
{
    let url = "http://localhost:3000/api/Players?playerId=" + uuid
    // let url = "http://chat.parkerjohnson-projects.com/api/Players?playerId=" + uuid

    let player
    httpGet(url, "json", 
        function (response)
        {
            player = JSON.parse(response)
            console.log(player)
            playerName = player.name

        }),
        function (error)
        {
            console.log(error)
            
        }
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
            let nums = new Uint32Array(1)
            if (name && name != "")
            {
                let uuid = crypto.getRandomValues(nums)[0];
                console.log(uuid)
                document.cookie = "uuid:" + uuid
                SendToMongo(uuid, name)
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
function inputListener(e)
{
    switch (e.key)
    {
        case "Enter":
            sendMessage()
            break;
        default:
            chatInput.html(e, true)
            break;
    }
}
function sendMessage()
{
    let text = chatInput.elt.value;
    chatInput.elt.value = "" //reset input 
    let li = createElement('li', `${playerName}: ${text}`)
    li.parent("chat_messages")
    socket.emit("chatMessage", text)
}
function draw()
{
    background(30)
    updatePlayers()
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
        let client = playersList.find(x => x.id == socket.id || x.id == 0)
        let clientJSON = JSON.stringify(client)
        socket.emit("clientData", clientJSON)
        console.log(clientJSON)

    }
}
function updateConnectedPlayers()
{
    socket.emit("requestUpdate")
    if (playersList.length > 1)
    {
        let connectedPlayers = playersList.filter(x => x.id != socket.id)
        for (let i = 0; i < connectedPlayers.length; i++)
        {
            circle(connectedPlayers[i].x, connectedPlayers[i].y, 20)
        }

    }
}
function updateClient()
{
    let player = playersList.find(x => (x.id == 0 || x.id == socket.id))

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
    // socket = io('localhost:3000')
    socket = io("ws://64.53.36.163:60003")

    socket.on("connect", () =>
    {
        socket.emit("clientConnection")
        playersList.find(x => x.id == 0).id = socket.id
    })
    socket.on("newChatMessage", (data) =>
    {
        addChatMessage(data)
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
}

function addChatMessage(message)
{
    //this is actually adding the current socket id lol.
    // not the remote client. need to send that info with the message
    let li = createElement('li', `remote: ${message}`)
    li.parent("chat_messages")
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

