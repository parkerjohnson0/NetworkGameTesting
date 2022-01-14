let base = null
let enemies = []
let grid = []
let GRID_WIDTH = 20
let NUM_OF_ENEMIES = 10;
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;

function setup()
{
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background(50);
    createGrid()
    createBase(200, 200);
    createEnemies()
    base.show()

}
function draw()
{
    for (let i = 0; i < NUM_OF_ENEMIES; i++)
    {
        enemies[i].move()
    }
}
function createGrid()
{
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_WIDTH)
    {
        for (let y = 0; y < CANVAS_HEIGHT; y += GRID_WIDTH)
        {
            new gridSquare(x, y).draw()
        }
    }
}
function createBase(x, y)
{
    base = new Base(x, y);
}
function createEnemies()
{
    for (let index = 0; index < NUM_OF_ENEMIES; index++)
    {
        let enemy = spawnEnemy()
        enemies.push(enemy)
        enemies[index].show();

    }
}
function spawnEnemy()
{
    let randomDirection = floor(random(4))
    let max = floor(random(0, CANVAS_HEIGHT) / 20)
    let randomNumber = max * 20
    if (randomDirection == 0)
    {
        return new Enemy(0, randomNumber)
    }
    else if (randomDirection == 1)
    {
        return new Enemy(CANVAS_WIDTH, randomNumber)
    }
    else if (randomDirection == 2)
    {
        return new Enemy(randomNumber, 0)
    }
    else if (randomDirection == 3)
    {
        return new Enemy(randomNumber, CANVAS_HEIGHT)
    }


}
class gridSquare
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    draw()
    {
        stroke('red')
        fill(0, 0, 0, 0)
        square(this.x, this.y, 20);
    }
}
class Enemy
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y
    }
    getPath()
    {

    }
    move()
    {

    }
    show()
    {
        ellipseMode(CORNER)
        stroke('transparent')
        fill('white')
        ellipse(this.x, this.y, 20)
    }
}
class Base
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;

    }
    show()
    {
        let sizeX = this.x
        let sizeY = this.y
        rectMode(CENTER)
        fill('white')
        stroke('transparent')
        rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, this.x, this.y);
    }
}