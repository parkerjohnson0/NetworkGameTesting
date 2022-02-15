class Tower4 {
    constructor(x, y, owner, row, col, cost, id){
        this.position = createVector(x,y);
        this.name = "Flame Tower";
        this.owner = owner;
        this.id = id;
        this.angle = 0;
        this.range = 60;
        this.r = 8;
        this.row = row;
        this.col = col;

        this.bullets = [];
        this.bulletsToRemove = [];
        this.damage = 1;
        this.refire = 0.25;
        this.speed = 10;
        this.fireTimer = new Timer(this.refire);

        this.currUpgradeCost = 10;
        this.upgradeMultiplier = 1.9;
        this.rank = 1;
        this.maxRank = 10;
        this.totalSpent = cost;
        this.type = {type: "normal",
        range: 0};
        this.animation = new spriteAnimation(10);
        this.animation.setFrames(resources.fireTower);
        this.animation.currentFrame = floor(random(0, resources.fireTower.length));
        this.sprite = this.animation.getCurrentFrame();
    }
    

    checkMouse(){
        if (dist(mouseX, mouseY, this.position.x, this.position.y) < 16) {
            canBuild = false;
        }
    }

    upgrade(){
        if (this.rank < this.maxRank){
        this.damage+=2;
        this.refire *= 0.95;
        this.range += 5;
        this.fireTimer.seconds = this.refire;
        this.totalSpent+=this.currUpgradeCost;
        this.currUpgradeCost = floor(this.currUpgradeCost*this.upgradeMultiplier);
        this.rank += 1;
        }
    }

    draw(){


        this.bullets = this.bullets.filter(item => !this.bulletsToRemove.includes(item));
        this.bulletsToRemove = [];
        
        let closest = 999999;
        let target = null;
        for (let enemy of testEnemies){
            let distance = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);
          if  ((distance < closest) && distance < this.range){
              closest = distance;
              target = enemy;
          }
        }
        let aimVector = createVector(0,0);
        target == null ? aimVector = aimVector : aimVector = createVector(target.position.x+target.sprite.width/2, target.position.y+target.sprite.height/2);
        let gunOffset = createVector(this.position.x+resources.towers[1].width/2, this.position.y+resources.towers[1].height/2);
        this.angle = atan2(aimVector.y - gunOffset.y, aimVector.x - gunOffset.x);
        fill(0,0,255);

        push();
        fill(255,0,0);
        imageMode(CENTER);
        translate(this.position.x, this.position.y);
        rotate(0);
        //target == null ? rotate(0) : rotate(this.angle+radians(270));
        this.sprite = this.animation.getCurrentFrame();
        image(this.sprite, 0, 0);
        
        pop();

        this.fireTimer.tick();
        if (!this.fireTimer.isTicking && target){
            this.fireTimer.start();
            this.bullets.push(new Bullet(this, target, resources.fire, this.angle+radians(270)));
        }
        
        if (this.fireTimer.isFinished){
            this.fireTimer.reset();
        }

        for (let bullet of this.bullets){
            bullet.draw();
        }

    }
}