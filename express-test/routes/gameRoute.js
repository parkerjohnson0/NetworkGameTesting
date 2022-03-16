let express = require('express');
let router = express.Router()

let path = require('path')

router.get('/',  async (req, res) =>
{
    let route = path.resolve(__dirname, '../public/')
    res.sendFile("game.html", {root: route})

})


module.exports = router