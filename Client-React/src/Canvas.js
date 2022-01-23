import React, { useEffect, useRef } from 'react';
const Canvas = props =>
{

    const canvasRef = useRef(null, 'canvas')
    const fps = props.fpscounter
    const playerList = props.players
    const client = props.client

    const draw = (ctx, canvas, players, client) =>
    {
        if (players)
        {

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // ctx.beginPath();
            // ctx.arc(client.x, client.y, 10, 0, 2 * Math.PI, false)
            // ctx.fillStyle = "white"
            // ctx.fill();
            players.map(player =>
            {
                console.log(player.x, " ", player.y)
                ctx.beginPath();
                ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI, false)
                ctx.fillStyle = "white"
                ctx.fill();

            })

            ctx.fillText(fps, 20, 20)
        }

    }
    useEffect(() =>
    {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        draw(context, canvas, playerList, client)
    }, [draw])


    return <canvas width="600" height="600" style={{ background: 'black' }} ref={canvasRef} {...props} />

}

export default Canvas