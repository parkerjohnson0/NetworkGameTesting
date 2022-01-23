// import { default as mongodb } from "mongodb";
let mongodb = require('mongodb')
let mongoClient = mongodb.MongoClient
//mongodb+srv://parker:Hcystydm%239@cluster0.hoegu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
class MongoDB{
    constructor(connectionString, database){
        this.connectionString = connectionString
        this.databaseName = database
    }    
    Connect(){
        mongoClient.connect(this.connectionString,(err, db)=>{
            if(err) throw err;
            this.databaseDriver = db.db(this.databaseName)
            console.log("connected")
            
        })
    }
    InsertDocument(obj, collection){
        this.databaseDriver.collection(collection).insertOne(obj, (err,res)=>{
            if (err) {
                return false;
            }
            return true
        })
    }
}
module.exports = MongoDB