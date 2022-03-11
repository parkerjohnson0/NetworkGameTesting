class Enemy
{
    constructor(x, y, currentTile)
    {
        this.position = createVector(x, y);
        this.maxSpeed = 0.7 + enemyBonusStats.speed;
        this.speed = this.maxSpeed;
        this.currMove = 0;
        this.currentTile = currentTile;
        this.goal = goal;
        this.navAgent = new NavAgent();
        this.path = this.navAgent.findPath(this.currentTile, this.goal);
        this.target = this.path[0];
        this.tileOffset = this.currentTile.w / 2;
        this.hp = 20 + 15 * currRound;
        this.isTargetable = false;
        this.canBeHitTile = this.path[0];
        this.killedBy = "";
        this.sprite;
        this.animation = new spriteAnimation(6);
        this.animation.setFrames(resources.zombieSprites);
        this.animation.currentFrame = floor(random(0, resources.zombieSprites.length));
        this.dir;
    }

    move()
    {
        // targettable at the start
        if (this.isTargetable == false)
        {
            let targetablePosition = createVector((this.canBeHitTile.position.x + this.tileOffset), (this.canBeHitTile.position.y + this.tileOffset));
            if (this.position.equals(targetablePosition))
            {
                this.isTargetable = true;
            }
        }
        let tilePosition = createVector((this.target.position.x + this.tileOffset), (this.target.position.y + this.tileOffset));
        if (this.vectorsEqual(tilePosition))
        {
        // if (tilePosition.equals(this.position))
        // {
            this.position = tilePosition;
            this.currentTile = this.target;
            this.path.shift();
            //this.path = this.navAgent.findPath(this.currentTile, this.goal);
            this.target = this.path[0];

            if (this.currentTile == this.goal)
            {
                this.speed = 0;
                this.target = this.currentTile;
            }
        }
        else
        {
            this.dir = createVector(this.target.position.x + this.tileOffset - this.position.x, this.target.position.y + this.tileOffset - this.position.y);
            this.dir = createVector(Math.sign(this.dir.x) * (delta / 20), Math.sign(this.dir.y) * (delta / 20)); 
            this.currMove += (this.speed * (delta / 20));
            //this.dir.mult(this.speed);
            if (this.currMove >= 1)
            {
                let vector = createVector(this.position.x + this.dir.x,this.position.y + this.dir.y);
                // this.position.add(this.dir);
                this.position = vector;
                this.currMove = 0;
            }

            if (this.speed < this.maxSpeed)
            {
                this.speed += (0.005 * (delta / 20));
            }
        }
    }
    vectorsEqual(tile)
    {
        let vector = createVector(Math.floor(this.position.x), Math.floor(this.position.y));
        return ((vector.x < tile.x + 10 && vector.x > tile.x - 10) &&
            (vector.y < tile.y + 10 && vector.y > tile.y - 10));
        // return tile.equals(vector);
    }
    onHit(damage, type = { type: "", range: 0, damage: 0 }, towerShotFrom)
    {
        this.killedBy = towerShotFrom.owner;
        this.hp -= damage;
        let damageType = type;
        if (damageType.type == "splash")
        {
            let allies = testEnemies.filter(enemy => dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y) < damageType.range && enemy != this)
            for (let ally of allies)
            {
                ally.onHit(type.damage, { type: "", range: 0, damage: 0 }, towerShotFrom);
            }
        }
        if (damageType.type == "slow")
        {
            this.speed = 0;
            let allies = testEnemies.filter(enemy => dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y) < damageType.range && enemy != this)
            for (let ally of allies)
            {
                if (ally.speed > .5 )
                {
                    ally.speed -= (damageType.slowAmount);
                }
                ally.onHit(type.damage, { type: "", range: 0, damage: 0 }, towerShotFrom);
            }
        }
    }
    update()
    {
        this.move();
    }
    draw()
    {
        this.move();
        fill(255, 255, 0);
        this.sprite = this.animation.getCurrentFrame();
        push();
        imageMode(CENTER);
        translate(Math.floor(this.position.x), Math.floor(this.position.y));
        if (this.dir.x > 0)
        {
            rotate(0);
        }
        if (this.dir.x < 0)
        {
            rotate(radians(180));
        }
        if (this.dir.y > 0)
        {
            rotate(radians(90));
        }
        if (this.dir.y < 0)
        {
            rotate(radians(270));
        }
        image(this.sprite, 0, 0);
        pop();

    }
}