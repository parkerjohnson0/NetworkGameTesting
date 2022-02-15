class Timer {
    constructor(seconds) {
        this.seconds = seconds;
        this.time = seconds * 60;
        this.isTicking = false;
        this.isFinished = false;
        
    }

    start(){
        this.isTicking = true;

    }

    stop(){
        this.isTicking = false;
    }

    reset(){
        this.stop();
        this.time = this.seconds * 60;
        this.isFinished = false;
    }

    tick(){
        if (this.isTicking) {
        this.time -= 1;
    }

    if (this.time <=0){
        this.isFinished = true;
        this.stop();
    }
}
}