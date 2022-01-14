let MongoDB = require('./database/MongoDB.js')
let express = require('express')
//how different would it be without body-parser
let bodyParser = require('body-parser')
let players = require('./routes/players.js')
const app = express()
app.use('/api/Players', players)
// app.use(bodyParser.json())
const port = 3000
let s = `mongodb+srv://parker:Hcystydm%239@cluster0.hoegu.mongodb.net/499Game?retryWrites=true&w=majority`
const mongo = new MongoDB(s, "499Game")
mongo.Connect()
// app.get('/api/Players',(req,res)=>{

// })
// app.post('/api/Players', (req,res)=>{
//     let player = req.body
//     mongo.InsertDocument(player,"Players")
// })
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})