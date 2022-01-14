let express = require('express')
let router = express.Router()
router.get('/',(req,res)=>{

})
router.post('/', (req,res)=>{
    let player = req.body
    mongo.InsertDocument(player,"Players")
})

module.exports = router