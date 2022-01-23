
let express = require('express')
let MongoDB = require('../database/MongoDB.js')
let router = express.Router()
const mongo = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
mongo.Connect()
router.get('/',(req,res)=>{

})
router.post('/', (req,res)=>{
    let player = req.body
    console.log(player)
    let success = mongo.InsertDocument(player,"Players")
    if (success){
        res.status(200).end()
    }
    else{
        res.status(400).end()
    }
})

module.exports = router