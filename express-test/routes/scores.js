
let express = require('express')
let MongoDB = require('../database/MongoDB.js')
let router = express.Router()
// const mongo = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
// mongo.Connect()

router.get('/',  async (req, res) =>
{
    let uuid = (req.query.uuid)
    let success = await req.app.db.FindOne(uuid,"Scores")
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

    let score = req.body
    console.log(score)
    let success = req.app.db.InsertDocument(score, "Scores")
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