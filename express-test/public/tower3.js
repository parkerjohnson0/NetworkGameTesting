class Tower3 {
    constructor(x, y, owner, row, col, cost, id){
        this.position = createVector(x,y);
        this.name = "Frost Tower";
        this.owner = owner;
        this.id = id;
        this.angle = 0;
        this.range = 40;
        this.r = 8;
        this.row = row;
        this.col = col;

        this.bullets = [];
        this.bulletsToRemove = [];
        this.damage = 3;
        this.refire = 3;
        this.speed = 10;
        this.fireTimer = new Timer(this.refire);

        this.currUpgradeCost = 10;
        this.upgradeMultiplier = 1.9;
        this.rank = 1;
        this.maxRank = 10;
        this.totalSpent = cost;
        this.type = {type: "slow",
        range: 40,
        slowAmount: 0.25,
        damage: this.damage*0.25};
        this.sprite = resources.towers[2];
    }
    

    checkMouse(){
        if (dist(mouseX, mouseY, this.position.x, this.position.y) < 16) {
            canBuild = false;
        }
    }

    upgrade(){
        if (this.rank < this.maxRank){
        this.damage+=5;
        this.refire *= 0.95;
        this.range += 3;
        this.type.slowAmount -= 0.05;
        this.type.range+=1;
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
              if (enemy.isTargetable){
                target = enemy;
                }
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
        // if (this.owner == 'p2'){
        //     tint(0, 0, 255, 255);
        //   }
        image(this.sprite, 0, 0);
        
        pop();

        this.fireTimer.tick();
        if (!this.fireTimer.isTicking && target){
            this.fireTimer.start();
            this.bullets.push(new Bullet(this, target, resources.ice, this.angle+radians(270)));
            sounds.ice.play();
        }
        
        if (this.fireTimer.isFinished){
            this.fireTimer.reset();
        }

        for (let bullet of this.bullets){
            bullet.draw();
        }

    }
}