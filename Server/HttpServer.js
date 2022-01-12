const http = require('http');
const crypto = require('crypto');
const static = require('node-static');//look more into this
const file = new static.Server('./') //look more into this
const httpServer = http.createServer((req, res) =>
{
    req.addListener('end', () => file.serve(req, res)).resume()
})
function HashEncode(key, GUID)
{
    let string = key + GUID
    let hash = crypto.createHash('sha1')
    hash.update(string)
    return hash.digest('base64')

}
//https://datatracker.ietf.org/doc/html/rfc6455#section-1.3
httpServer.on('upgrade', (req, webSocket) =>
{
    //maybe use req.upgrade. dont know if it's the exact same
    if (req.headers['upgrade'] !== 'websocket')
    {
        webSocket.end('HTTP/1.1 400 Bad Request')
        return;
    }
    //if upgrade requested. 
    let key = req.headers['sec-websocket-key']
    let GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
    //concatentate the two above and then SHA-1 hash and base64 encode. 
    let computedKey = HashEncode(key, GUID)
    //build then send the response and complete the upgrade to websocket
    let response = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${computedKey}`
    ]

    webSocket.write(response.join(`\r\n`) + `\r\n\r\n`)
    console.log(response)

    console.log("Client connected");
    sockets.push(webSocket)
    webSocket.on('data', data =>
    {
        // let json = parseData(data).toString()
        try
        {
            if (json.EventType == "ClientData")
            {
                messageReceived = true;
                updateClientData();
            }
        } catch (error)
        {
            console.log("Error")
        }


        // sendToClients()
    });

});
function parseData(data)
{
    //gets a little more complicated if use extension for the websocket. not gonna do that
    //https://datatracker.ietf.org/doc/html/rfc6455#section-5
    let firstByte = data.readUint8(0);
    let finalFragment = firstByte & 1 == 1
    let RSV1 = firstByte & 2 == 1
    let RSV2 = firstByte & 4 == 1
    let RSV3 = firstByte & 8 == 1
    let opcode = (firstByte & 120) >>> 4
    let secondByte = data.readUint8(1);
    let isMasked = (secondByte & 128) >>> 7 == 1
    //this is fucked
    let payloadLength = (secondByte & 127)
    if (payloadLength == 126 || payloadLength == 127)
    {
        payloadLength = addBytesToPayLoad(payloadLength, data)
    }
    let payload
    if (isMasked)
    {
        let maskKey = getMaskKey(data)
        payload = unmaskData(data, maskKey)
    }
    else payload = unmaskData(data)
    return payload
}
function unmaskData(data)
{
    let offset = 14
    let payload = new Buffer()
    for (offset; offset < data.length; offset++)
    {
        payload.push(data.readUint8(offset))
    }
}
function unmaskData(data, maskKey)
{
    let offset = 14
    let payload = Buffer.from(new Uint8Array())
    let bufferList = []
    for (offset; offset < data.length; offset++)
    {
        bufferList.push(Buffer.from((data[offset] ^ maskKey[offset % 4]).toString()))
    }
    payload = Buffer.concat(bufferList)
    return payload

}
function getMaskKey(data)
{
    let offset = 10;
    // let key = 1
    let key = Buffer.from(new Uint8Array())
    let bufferList = []
    for (offset; offset < 13; offset++)
    {
        bufferList.push(Buffer.from(data[offset].toString()))
        // key *= data.readUint8(offset)
    }
    key = Buffer.concat(bufferList)

    return key
}
function addBytesToPayLoad(payloadLength, data)
{
    let extendedLength = 1
    let offset = 2
    if (payloadLength == 126)
    {
        for (offset; offset < 2; offset++)
        {
            extendedLength *= data.readUint8(offset)
        }
    }
    if (payloadLength == 127)
    {
        for (offset; offset < 6; offset++)
        {
            extendedLength *= data.readUint8(10)
        }

    }
}
const port = 3000
httpServer.listen(port, () => console.log(`http server listening on port ${port}`))
let playerData = []
let messageReceived = false;
let sockets = []


// httpServer.on('connection', socket =>
// {
//     console.log("Client connected");
//     sockets.push(socket)
//     socket.on('data', data =>
//     {
//         let json
//         try
//         {
//             let string = data.toString()
//             json = JSON.parse(string)
//             if (json.EventType == "ClientData")
//             {
//                 messageReceived = true;
//                 updateClientData();
//             }
//         } catch (error)
//         {
//             console.log("Error")
//         }


//         // sendToClients()
//     });

// });
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