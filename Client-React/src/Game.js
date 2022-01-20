import React from 'react';
import Canvas from './Canvas';
const { io } = require('socket.io-client');
class Player
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
        this.id = 0
    }
}
export default class Game extends React.Component
{
    clientPlayer = new Player(Math.random() * 200 + 200, Math.random() * 400 + 100)
    playersList = []
    constructor(props)
    {
        super(props)
        this.state = {
            players: this.playersList,
            client: this.clientPlayer
        }
        this.setupSocket = this.setupSocket.bind(this)

        this.handlePlayerUpdate = this.handlePlayerUpdate.bind(this)
        this.sendClientState = this.sendClientState.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
        this.update = this.update.bind(this)
        this.draw = this.draw.bind(this)
        this.loop = this.loop.bind(this)
    }
    draw()
    {
        this.setState({
            players: this.playersList,
            client: this.clientPlayer
        })
    }
    handleMessage(e)
    {
        if (this.playersList.some(player => player.id == this.clientPlayer.id))
            this.playersList.map((player, index) =>
            {

            })
    }
    loop(timestamp)
    {
        fpsCounter = timestamp - lastRender;
        delta += fpsCounter;
        fps = Math.round(1 / (fpsCounter / 1000));
        while (delta >= timestep)
        {
            this.update(delta);
            delta -= timestep;
        };
        this.draw();
        lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
    }
    componentDidMount()
    {
        window.requestAnimationFrame(this.loop)
        this.setupSocket();
    }
    setupSocket()
    {
        let socket = io("ws://64.53.36.163:60003")
        // let socket = io('localhost:3001')
        this.setState({
            socket: socket
        })
        //i believe it is important to emit another event here because
        //the listeners on the server need to be nested deeper. or else 
        //issues of other events being called before the connection code has fully run
        socket.on("connect", () =>
        {

            socket.emit("clientConnection")
            this.state.client.id = socket.id
        })
        //listen for incoming player data
        socket.on("playerData", (data) =>
        {
            this.setState({
                players: JSON.parse(data)
            })
        })
        // socket.onmessage = (json) =>
        // {
        //     let players = JSON.parse(json.data)
        //     if (players)
        //     {
        //         this.playersList = players

        //     }
        // this.setState({
        //     players: [JSON.parse(json.data)]
        // })

    }
    handlePlayerUpdate()
    {
        // if (this.playersList)
        // {
        //     let playerRef = this.playersList.find(player => player.id == this.clientPlayer.id)
        //     playerRef.x = this.clientPlayer.x
        //     playerRef.y = this.clientPlayer.y

        //     this.setState({
        //         players: [this.playersList]
        //     })
        // }

    }
    sendClientState()
    {

        if (this.state.socket && this.state.socket.connected)
        {
            let clientJSON = JSON.stringify(this.state.client)
            this.state.socket.emit("clientData", clientJSON)
            // let message = {
            //     "EventType": "ClientData",
            //     "Data": this.state.client
            // }

            // this.state.socket.send(JSON.stringify(message))
        }
    }
    getOtherPlayersState(e)
    {
        // if (this.state.socket && this.state.socket.readyState == WebSocket.OPEN)
        // {
        //     // this.state.players = e.data
        // }
    }
    update(progress)
    {
        let player = this.state.client
        progress /= 2
        if (Up)
        {
            player.y -= progress;
        }
        if (Down)
        {
            player.y += progress;
        }
        if (Left)
        {
            player.x -= progress;
        }
        if (Right)
        {
            player.x += progress;
        }
        this.setState({
            client: player
        })
        this.state.socket.emit("requestUpdate")
        this.handlePlayerUpdate()
        this.getOtherPlayersState();
        this.sendClientState();

    }

    render()
    {
        return (
            <div>
                <p id="counter">
                </p>
                <div id="root">
                    <Canvas client={this.state.client} players={this.state.players} fpscounter={fps}>

                    </Canvas>
                    {/* <canvas
                        id="test" width="600" height="600" style="background-color:#000000"
                        ref={(c) => canvasRef = c.getContext('2d')}>
                    </canvas> */}
                </div>
            </div>

        )
    }
}
window.addEventListener("keydown", function (e)
{
    if (e.defaultPrevented)
    {
        return;
    }
    switch (e.key)
    {
        case "w":
            Up = true;
            break;
        case "a":
            Left = true;
            break;
        case "s":
            Down = true;
            break;
        case "d":
            Right = true;
            break;
    }
})
window.addEventListener("keyup", function (e)
{
    if (e.defaultPrevented)
    {
        return;
    }
    switch (e.key)
    {
        case "w":
            Up = false;
            break;
        case "a":
            Left = false;
            break;
        case "s":
            Down = false;
            break;
        case "d":
            Right = false;
            break;
    }
})
let Up = false;
let Left = false;

let Right = false;
let Down = false;

// let canvas = canvasRef;
// let ctx = canvas.getContext("2d");
// ctx.fillStyle = "white";
// ctx.font = '20px comic sans';
// let x = canvas.height / 2;
// let y = canvas.width / 2;


// function update(progress)
// {

//     progress /= 2
//     if (Up)
//     {
//         clientPlayer.y -= progress;
//     }
//     if (Down)
//     {
//         clientPlayer.y += progress;
//     }
//     if (Left)
//     {
//         clientPlayer.x -= progress;
//     }
//     if (Right)
//     {
//         clientPlayer.x += progress;
//     }
//     window.gameComponent.handlePlayerUpdate()
//     GetOtherPlayersState();
//     SendClientState();
// }

// function SendClientState()
// {
//     if (socket.readyState == WebSocket.OPEN)
//     {
//         let message = {

//         }
//         socket.send(JSON.stringify(message))
//     }
// }
// function GetOtherPlayersState()
// {

// }
// let clientPlayer = new Player(x, y);
// function draw()
// {

// ctx.clearRect(0, 0, canvas.width, canvas.height)
// ctx.beginPath();
// ctx.arc(clientPlayer.x, clientPlayer.y, 10, 0, 2 * Math.PI, false)
// ctx.fillStyle = "white"
// ctx.fill();
// ctx.fillText(fps, 20, 20)

// }
let timestep = 1000 / 60;
let delta = 0
let fps = 0;
let fpsCounter = 0
// function loop(timestamp)
// {
//     fpsCounter = timestamp - lastRender;
//     delta += fpsCounter;
//     fps = Math.round(1 / (fpsCounter / 1000));
//     while (delta >= timestep)
//     {
//         update(delta);
//         delta -= timestep;
//     };
//     draw();
//     lastRender = timestamp;
//     window.requestAnimationFrame(loop);
// }
let lastRender = 0
// window.requestAnimationFrame(loop)

