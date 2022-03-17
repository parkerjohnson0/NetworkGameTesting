
let express = require('express')
let MongoDB = require('../database/MongoDB.js')
let router = express.Router()
let path = require('path')
// const mongo = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
// mongo.Connect()

router.get('/',  async (req, res) =>
{
    // let route = path.resolve(__dirname, '../views/')
    // console.log("sending route", route)
    // res.sendFile("leaderboard.html", { root: route })
    let scores = await req.app.db.FindAll("Leaderboard")
    let route = path.resolve(__dirname, '../public/')
    console.log("sending route", route)
    // res.sendFile("scores.html",{root: route})
    res.render("scoresView.ejs", { scores })

    
    // let success = await req.app.db.FindAll("Leaderboard")
    // if (success)
    // {
    //     res.json(JSON.stringify(success))
    //     res.status(200).end()
    // }
    // else
    // {
    //     res.status(400).end()
    // }
})
// router.post('/', (req, res) =>
// {

//     let score = req.body
//     console.log(score)
//     let success = req.app.db.InsertDocument(score, "Leaderboard")
//     if (success)
//     {
//         res.status(200).end()
//     }
//     else
//     {
//         res.status(400).end()
//     }
// })

module.exports = router