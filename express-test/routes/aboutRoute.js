
let express = require('express')
let MongoDB = require('../database/MongoDB.js')
let router = express.Router()
let path = require('path')
// const mongo = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
// mongo.Connect()

router.get('/',  async (req, res) =>
{
    let route = path.resolve(__dirname, '../public/')
    res.sendFile("about.html", {root: route})

})


module.exports = router