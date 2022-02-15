class spriteAnimation {
    constructor(frameDelay){
        this.frames;
        this.delay = frameDelay;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.isPlaying = true;
    }

setFrames(frames) {
 this.frames = frames;
}

stop(){
    this.isPlaying = false;
    this.currentFrame = 0;
}

play(){
    this.isPlaying = true;
}

getCurrentFrame() {

    if (this.isPlaying){
    this.frameCount += 1;
    if (this.frameCount > (this.delay)){
        this.currentFrame = (this.currentFrame +1) % this.frames.length;
        this.frameCount = 0;
    }
}
    return this.frames[this.currentFrame];
}

}