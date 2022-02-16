"use strict";
class Tile {
    constructor(x, y, r, c, bounds, pathable) {
        this.position = createVector(x,y);
        this.r = r;
        this.c = c;
        this.w = 20;
        this.h = 0;
        
        this.image;
        this.rand = random(1);
        if (this.rand <= 0.01) {
            this.image = resources.tiles[0];
        }
        
        else if (this.rand > 0.01 && this.rand <=0.65) {
            this.image = resources.tiles[1];
        }
        else{
            this.image = random(resources.tiles.slice(2,resources.tiles.length));
        }



        //debug
        this.path = false;
        this.end = false;

        //A* Params
        this.f=0;
        this.g=0;
        this.h=0;
        this.neighbors = [];
        this.previous;
        this.isPathable = pathable;
        this.outOfBounds = bounds;

        this.outOfBounds ? this.image=resources.caveSprites[0] : false;
    }

    reset(){
        this.f=0;
        this.g=0;
        this.h=0;
        this.previous = undefined;
    }

    checkState(){
    }


    
    draw() {
        //this.checkState();
        // let shade = this.isPathable ? color(255,255,255) : color(255,0,0);
        // fill(shade);

        //test
        if (this.r == 16 && this.c == 16){
            fill(255,0,255);
        }
        if (this.r == 11 && this.c == 0 || this.r == 11 && this.c == gameMap.cols-1){
           this.image=resources.tiles[1];
        }

        if (this.c == gameMap.cols-1){
            push();
            imageMode(CENTER);
            translate(this.position.x+gameMap.tileWidth/2, this.position.y+gameMap.tileHeight/2);
            rotate(radians(180));
            image(this.image,0,0);
            pop();
        }
        else{
            image(this.image,this.position.x, this.position.y);
        }

        stroke(78,78,78,62);
        noFill();
        rectMode(CORNER);
        square(this.position.x, this.position.y, this.w);
        // fill(0);
        // textSize(8);
        // text(`${this.r},${this.c}`, this.position.x+2, this.position.y-5);

    }

}