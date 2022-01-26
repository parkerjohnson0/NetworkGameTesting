import {v4 as uuid} from 'uuid'
class Player{
    constructor(name){
        this.name = name
        this.id = uuid()
    }
}