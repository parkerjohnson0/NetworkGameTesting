class NameBox
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = new p5Input(x - width / 4, y - height / 4, 250, 25,12);
        this.isEnabled = false;
    }
    draw()
    {
        push();

        rectMode(CENTER);
        fill(100,100,100, 200)
        rect(this.x, this.y, this.width, this.height, 10);
        this.input.draw();
        fill(255)
        text("NAME", this.x - 170, this.y + 5)
        pop();
    }
    enable()
    {
        this.isEnabled = true;
    }
    disable()
    {
        this.isEnabled = false;
    }
    inputClicked()
    {
        return mouseX > this.input.x && mouseX < this.input.x + this.input.width &&
        mouseY > this.input.y && mouseY < this.input.y + this.input.height;
    
    }
}