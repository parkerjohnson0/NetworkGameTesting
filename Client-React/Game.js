import React from 'react';
import Canvas from './Canvas';
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
let x = canvas.height / 2;
let y = canvas.width / 2;


function update(progress)
{

    progress /= 2
    if (Up)
    {
        y -= progress;
    }
    if (Down)
    {
        y += progress;
    }
    if (Left)
    {
        x -= progress;
    }
    if (Right)
    {
        x += progress;
    }
    GetOtherPlayersState();
    SendClientState();
}
let socket = new WebSocket("ws://localhost:8080");
socket.addEventListener('open', () =>
{
})
function SendClientState()
{
    if (socket.readyState == WebSocket.OPEN)
    {
        let message = {
            x: x,
            y: y,
        }
        socket.send(JSON.stringify(message))
    }
}
function GetOtherPlayersState()
{

}
let clientPlayer = new Player(x, y);
function draw()
{

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath();
    ctx.arc(clientPlayer.x, clientPlayer.y, 10, 0, 2 * Math.PI, false)
    ctx.fillStyle = "white"
    ctx.fill();
    ctx.fillText(fps, 20, 20)

}
let timestep = 1000 / 60;
let delta = 0
let fps = 0;
let fpsCounter = 0
function loop(timestamp)
{
    fpsCounter = timestamp - lastRender;
    delta += fpsCounter;
    fps = Math.round(1 / (fpsCounter / 1000));
    console.log(fps);
    while (delta >= timestep)
    {
        update(delta);
        delta -= timestep;
    };
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
let lastRender = 0
window.requestAnimationFrame(loop)

export default class Game extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            players: [{}]
        }
    }
    render()
    {
        return (
            <div>
                <p id="counter">
                </p>
                <div id="root">
                    <Canvas>

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
class Player
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
    }
}