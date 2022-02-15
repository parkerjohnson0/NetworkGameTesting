class FloatingText {
    constructor(text, position, color){
        this.content = text;
        this.position = position.copy();
        this.alpha = 255;
        this.color = color;
        
    }

    draw() {
        push();
        fill(this.color);
        text(this.content,this.position.x, this.position.y);
        pop();
        this.alpha -= 4;
        this.color.setAlpha(this.alpha);
        this.position.sub(0,1);
    }

}