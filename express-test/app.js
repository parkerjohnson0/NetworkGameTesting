require('dotenv').config()
let io = require('./server/SocketIO.js')
let cors = require('cors')
// let corsOptions = {
//     origin: ['https://localhost:5500', 'http:game.parkerjohnson-projects.com'],
//     optionsSuccesStatus : 200
// }
let MongoDB = require('./database/MongoDB.js')
// let MongoDB = require('./database/MongoDB.js')
let express = require('express')
let https = require('https')
let http = require('http')
let fs = require('fs')
//how different would it be without body-parser
let bodyParser = require('body-parser')
let players = require('./routes/players.js')
let home = require('./routes/home.js')
const app = express()
app.cors = cors
app.db = new MongoDB(process.env.CONNECTION_STRING, process.env.DB)
app.db.Connect();
app.use(cors({
    origin: ["https://localhost:8443", "http://chat.parkerjohnson-projects.com",
        "https://www.skelegame.com", "http://www.skelegame.com","http://localhost:8080"
    ]
}))
//MAY NEED OTHER BODYPARSER TYPES AT SOME POINT
app.use(bodyParser.json())
app.use(express.static('./public'))
app.use('/api/Players', players)
app.use('/', home)


// let connection = `mongodb+srv://parker:Hcystydm%239@cluster0.hoegu.mongodb.net/499Game?retryWrites=true&w=majority`
// const mongo = new MongoDB(connection, "499Game")
// mongo.Connect()
// app.get('/api/Players',(req,res)=>{

// })
// app.post('/api/Players', (req,res)=>{
//     let player = req.body
//     mongo.InsertDocument(player,"Players")
// })
let httpsServer = https.createServer(
    {
        key: fs.readFileSync("skelegame.key"),
        cert: fs.readFileSync("skelegame.crt")
    },
    app).listen(8080, () =>
    {
    console.log("listening on port " + 8080)
    })

io(httpsServer)
    
let httpServer = http.createServer(app).listen(8443, () =>
    {
    console.log("listening on port " + 8443)
    })

io(httpServer)
