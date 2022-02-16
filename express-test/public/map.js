class Map {
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.tileMap;
        this.tileWidth = 20;
        this.tileHeight = 20;

        this.navChecker = new NavAgent();

    }

    draw(){

        for (let row of this.tileMap){
            for (let tile of row){
              tile.draw();
            }
          }
        
    }

    getTile(){
        let col =  mouseX > 0 ? floor(mouseX/20) : 0;
        let row = mouseY > 0 ? floor(mouseY/20) : 0;
        return this.tileMap[row][col];
    }

    getFreeTiles(){
        let free = [];

        for (let r = 0; r<this.rows; r++){
            for (let c =0; c<this.cols; c++){
                //this.tileMap[r][c].isPathable ? free.push(this.tileMap[r][c]) : null;               
            }
        }

        return free;
    }

    generate(rows=this.rows, cols=this.cols) {
        this.rows = rows;
        this.cols = cols;


        //Perlin Noise Settings
        let seed = int(random(0,39654));
        noiseSeed(seed);
        let scalar = 0.009 - 0.004;
        let threshold = 0.35;

        randomSeed(seed);
        
        let newMap = Array.from({length: rows}, () => Array(cols).fill(0));
        
        for (let row = 0; row <rows; row++){
            for (let col =0; col<cols; col++){
                let xPos = col * this.tileWidth;
                let yPos = row * this.tileHeight;
                let bounds = false;
                let pathable=true;
                if (col == 0 || col==cols-1){
                    bounds = true;
                    pathable = false;
                }
                newMap[row][col] = new Tile(xPos, yPos,row, col, bounds, pathable);

        }
    }

        this.tileMap = newMap;


        //Assign Neighbors
        for (let r =0;r<this.rows; r++){
            for (let c=0; c<this.cols; c++){
                let current = this.tileMap[r][c];

                if(r>0){
                    if (this.tileMap[r-1][c].isPathable){
                    current.neighbors.push(this.tileMap[r-1][c]);
                    }
                }
                if(c<this.cols-1){
                    if (this.tileMap[r][c+1].isPathable){
                    current.neighbors.push(this.tileMap[r][c+1]);
                    }
                }
                if(r<this.rows-1){
                    if (this.tileMap[r+1][c].isPathable){
                    current.neighbors.push(this.tileMap[r+1][c]);
                    }
                }
                if(c>0){
                    if (this.tileMap[r][c-1].isPathable){
                    current.neighbors.push(this.tileMap[r][c-1]);
                    }
                }
            }
        }


    }

    checkUnconnectedNeighbors(tile){
        let list = [];
        let r = tile.r;
        let c = tile.c;
                if(r>0){
                    list.push(this.tileMap[r-1][c]);
                }
                if(c<this.cols-1){
                    list.push(this.tileMap[r][c+1]);
                }
                if(r<this.rows-1){
                    list.push(this.tileMap[r+1][c]);
                }
                if(c>0){
                    list.push(this.tileMap[r][c-1]);
            }
    return list;
}

edgeCases(tile){
    let r = tile.r;
    let c = tile.c;
    if (r == 0 || r == this.rows-1){
            if (c==0 || c==this.cols-1){
                return 2;
            }
            else if (c > 0 && c<this.cols-1){
                return 3;
            }
    }
    else if (r > 0 && r < this.rows-1){
            if (c==0 || c==this.cols-1){
                return 3;
            }
    }
        return 4;
        
    }

}