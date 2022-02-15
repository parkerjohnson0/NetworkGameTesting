class AnimationTimer {
    constructor(seconds, parent) {
        this.seconds = seconds;
        this.time = seconds * 60;
        this.isTicking = false;
        this.isFinished = false;

       // this.position;
        this.offset = createVector(-8,-8);
        this.parent = parent;

        this.animation = new spriteAnimation((this.seconds)/(resources.progressBar.length));
        this.animation.setFrames(resources.progressBar);
        this.sprite = this.animation.getCurrentFrame();
        this.animation.stop();
        
    }

    start(){
        this.isTicking = true;

        if (this.parent){
            this.animation.play();
        }
    }

    stop(){
        this.isTicking = false;
        this.animation.stop();
    }

    reset(){
        this.stop();
        this.time = this.seconds * 60;
        this.isFinished = false;
    }

    tick(){
        if (this.isTicking) {
        this.time -= 1;
    if (this.time <=0){
        this.isFinished = true;
        stop();
    }
}
}
}