class RoundText {

    constructor(){
        this.timer = new Timer(4, true);
        this.text = '';
        this.baseTextSize = 32;
        this.currTextSize = this.baseTextSize;
        this.alpha = 255;
        this.baseColor = color(255,255,255,255);
        this.currColor = this.baseColor;
        this.active = false;

    }

    activate(){
        this.active = true;
    }

    start(){
        if (!this.active){
        this.timer.start();
        this.activate();
        }
    }

    reset(){
        this.alpha = 255;
        this.currTextSize = this.baseTextSize;
        this.currColor = this.baseColor;
        this.timer.reset();
    }

    setText(text){
        this.text = text;
    }


    draw(){
        this.timer.tick();
        if (this.timer.isTicking){
            push();
            textAlign(CENTER);
            fill(this.currColor);
            textSize(this.currTextSize);
            text(this.text,playWidth/2, playHeight/2);
            this.currTextSize+=0.5;
            this.alpha -= 3;
            this.currColor = color(255,255,255, this.alpha);
            pop();
        }

        if (this.timer.time <= 0 || this.alpha <= 0){
            this.active = false;
            this.timer.stop();
        }
    }
}