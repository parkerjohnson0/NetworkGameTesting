class Timer {
    constructor(seconds, useDelta=false) {
        this.useDelta = useDelta; // pass true to the constructor to make UI animations play properly at any framerate 
        this.seconds = seconds;
        this.time = seconds * 60;
        this.isTicking = false;
        this.isFinished = false;
        this.timerRequested = false;
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
            if (this.useDelta){
                this.time -= 1 * (deltaTime / timestep);
            }
            else{
                this.time -= 1;
            }
    }

    if (this.time <=0){
        this.isFinished = true;
        this.stop();
    }
}
}