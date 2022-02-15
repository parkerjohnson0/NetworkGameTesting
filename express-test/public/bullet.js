class Bullet {
    constructor(parent, target, spritesheet=null, angle=0){
        this.parent = parent;
        this.speed = parent.speed;
        this.target = target;
        this.targetPosition = target.position.copy();
        this.position = parent.position.copy();
        this.damage = parent.damage;
        this.type = parent.type;
        this.spritesheet = spritesheet;
        this.animation = new spriteAnimation(5);
        this.hasCollided = false;
        this.alpha = 128;
        this.angle = angle;
        if (this.spritesheet){
            this.animation.setFrames(this.spritesheet.slice(1));
        }

        this.dir = createVector((this.targetPosition.x)-this.position.x, (this.targetPosition.y)-this.position.y);
        this.dir = this.dir.div(this.speed);

    }

    onHit(){
            this.target.onHit(this.damage, this.type);
            this.position = this.target.position.copy();
            this.hasCollided = true;

            if (this.type.type == "normal"){
                this.alpha = 0;
            }
            
    }

    draw(){
    if (!this.hasCollided){
        this.position.add(this.dir);
        let distance = dist(this.position.x, this.position.y, this.targetPosition.x, this.targetPosition.y);
        if  (distance <= 20 + 4){
            this.onHit();
        }
        //fill(25,25,25);
        let sprite = this.spritesheet[0];
        if (this.angle !=0){
            push();
            imageMode(CENTER);
            translate(this.position.x, this.position.y);
            rotate(this.angle);
            image(sprite, 0, 0);
            pop();
        }
        else {
        push();
        imageMode(CENTER);
        image(sprite, this.position.x, this.position.y);
        pop();
        }
    }
    else {

        if (this.spritesheet){
            let sprite = this.animation.getCurrentFrame();
            push();
            imageMode(CENTER);
            image(sprite, this.position.x, this.position.y);
            pop();
            this.alpha -= 1;

            if (this.alpha <= 0){
                this.parent.bulletsToRemove.push(this);
            }
        }
    }
    }
}