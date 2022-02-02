let express = require('express');
let router = express.Router()

router.get('/', async (req, res) =>
{
    console.log("sending route")
    res.sendFile("index.html")
})

 module.exports = router