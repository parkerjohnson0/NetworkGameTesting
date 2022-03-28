class p5Input
{
    constructor(x, y, width, height, maxChar)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxChar = maxChar;
        this.text = '';
        this.displayText = '';
        document.addEventListener('keydown', (event) =>
        {
            if (event.key === 'Backspace')
            {
                if (textWidth(this.displayText) > this.width)
                {
                    
                }
                this.removeText();
                
            }
        })
        this.focused = false;
        this.timer = new Timer(1, true);
	this.blinking = false;
    }
    mousePressed()
    {

    }
    draw()
    {

        if (textWidth(this.displayText) > this.width - 5)
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
		line(this.x + textWidth(this.displayText) + 5, this.y + 10, this.x + textWidth(this.displayText) + 5,this.y + 20)

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
        let index
        if ((index = this.text.indexOf(this.displayText)) > 0) //means that text contains the entirety of the displayed + extra. scroll displayed text left to right
        {
            this.displayText = this.text[index - 1] + this.displayText;
        }
        this.text = this.text.slice(0, -1);
        this.displayText = this.displayText.slice(0, -1);

    }
    handleKey(key)
    {
        if (this.text.length > this.maxChar) return;
        this.text += key;
        this.displayText += key;
    }
    reset()
    {
        this.text = '';
        this.displayText = '';
    }

}
