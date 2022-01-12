const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: 60003 });
let playerData = []
let messageReceived = false;
let sockets = []


webSocketServer.on('connection', socket =>
{
    console.log("Client connected");
    sockets.push(socket)
    socket.on('message', data =>
    {
        messageReceived = true;
        let json = JSON.parse(data)
        if (json.EventType === 'ClientData')
        {
            updateClientData(json.Data);
        }
        else if (json.EventType === 'ChatMessage')
        {
            updateChat(json)
        }
        // sendToClients()
    });

});
setInterval(update, 16)
function update()
{
    if (messageReceived)
    {

        sendToClients()
        messageReceived = false;
    }

}
function updateClientData(data)
{
    // console.log(data)

    if (playerData.length == 0 || !playerData.filter(e => e.id == data.id)[0]) 
    {
        playerData.push(data)
        console.log(playerData)
    }
    else
    {
        let client = playerData.filter(e => e.id === data.id)[0]
        let indexOfClient = playerData.indexOf(client)
        playerData[indexOfClient] = data
    }
}
function sendToClients()
{
    sockets.map(socket =>
    {
        socket.send(JSON.stringify(playerData))
    })
}

class Player
{
    constructor(x, y, id)
    {
        this.x = x
        this.y = y
        this.id = id
    }
}