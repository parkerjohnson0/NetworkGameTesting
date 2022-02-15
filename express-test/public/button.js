class Button {
    constructor(imageset, cost, towerType, x,y){
        this.images = imageset;
        this.position = createVector(x,y);
        this.cost = cost;
        this.identifier = towerType;
    }

    draw(){
        if (this.identifier >=0){
        gold >= this.cost ? image(this.images[1],this.position.x,this.position.y) : image(this.images[0],this.position.x,this.position.y);
    }
    else {
        towerToBuild == this.identifier ? image(this.images[1],this.position.x,this.position.y) : image(this.images[0],this.position.x,this.position.y);
    }
}
}