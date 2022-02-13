
let express = require('express')
let MongoDB = require('../database/MongoDB.js')
let router = express.Router()
// const mongo = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
// mongo.Connect()

router.get('/',  async (req, res) =>
{
    let playerId = (req.query.playerId)
    let success = await req.app.db.FindOne(playerId,"Players")
    if (success)
    {
        res.json(JSON.stringify(success))
        res.status(200).end()
    }
    else
    {
        res.status(400).end()
    }
})
router.post('/', (req, res) =>
{

    let player = req.body
    console.log(player)
    let success = req.app.db.InsertDocument(player, "Players")
    if (success)
    {
        res.status(200).end()
    }
    else
    {
        res.status(400).end()
    }
})

module.exports = router