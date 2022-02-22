class p5Input
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = '';
        this.displayText = '';
        document.addEventListener('keydown', (event) =>
        {
            if (event.key === 'Backspace')
            {
                this.removeText();
            }
        })
        this.focused = false;
        this.timer = new Timer(1);
	this.blinking = false;
    }
    mousePressed()
    {

    }
    draw()
    {

        if (textWidth(this.displayText) > this.width)
        {
            this.displayText = this.displayText.substring(1);
        }
        push();
        rectMode(CORNER)
        if (this.focused)
        {
		this.timer.start();
            strokeWeight(2);
            stroke(51);
        }
        fill('white');
        rect(this.x, this.y, this.width, this.height);
        fill('black');
        noStroke();
        text(this.displayText, this.x + 5, this.y + 20)
	if (this.focused && !this.blinking){
		fill('black');
            stroke(51);
            strokeWeight(2);
		line(this.x + textWidth(this.displayText) + 3, this.y + this.height * .33, this.x + textWidth(this.displayText) + 3,this.y + this.height * .75)

	}
	if (this.timer.isFinished){
		this.blinking = !this.blinking;
		this.timer.reset();
	}
	if (this.timer.isTicking){
		this.timer.tick();
	}
        // console.log(this.text);
        pop();
    }
    focus()
    {
        this.focused = true;
    }
    unfocus()
    {
        this.focused = false;
    }
    removeText()
    {
        this.text = this.text.slice(0, -1);
        this.displayText = this.displayText.slice(0, -1);

    }
    handleKey(key)
    {
        this.text += key;
        this.displayText += key;
    }
    reset()
    {
        this.text = '';
        this.displayText = '';
    }

}