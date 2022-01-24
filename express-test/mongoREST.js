require('dotenv').config()
let MongoDB = require('./database/MongoDB.js')
// let MongoDB = require('./database/MongoDB.js')
let express = require('express')
//how different would it be without body-parser
let bodyParser = require('body-parser')
let players = require('./routes/players.js')
const app = express()
app.db = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
app.db.Connect();
//MAY NEED OTHER BODYPARSER TYPES AT SOME POINT
app.use(bodyParser.json())
app.use('/api/Players', players)
const port = 3000
// let connection = `mongodb+srv://parker:Hcystydm%239@cluster0.hoegu.mongodb.net/499Game?retryWrites=true&w=majority`
// const mongo = new MongoDB(connection, "499Game")
// mongo.Connect()
// app.get('/api/Players',(req,res)=>{

// })
// app.post('/api/Players', (req,res)=>{
//     let player = req.body
//     mongo.InsertDocument(player,"Players")
// })
app.listen(port, () =>
{
    console.log(`listening on port ${port}`)
})