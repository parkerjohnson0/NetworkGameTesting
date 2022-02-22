
class ChatBox
{
    messages = []
    messageOffset = 25 //space between messages
    padding = 15 //space between edge of box and the text
    text_size = 14 
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = createInput("", "text")
<<<<<<< Updated upstream
        this.input.position(-200 + this.padding, 275 - this.padding, "relative")
        this.input.size(200, 15)
        this.button = createButton("Chat")
        this.button.position(-200 + this.padding, 275 - this.padding, "relative")
=======
        this.input.elt["maxLength"] = 70
        this.input.position(this.x + this.padding, -55, "relative")
        this.input.parent("#game_container")
        this.input.elt.style.visibility = "hidden";
        this.input.style("font-family","SuperLegendBoy");
        this.input.size(250, 25)
        this.active = false;
        this.p5Input = new p5Input(this.x + this.padding, 530 , 250 , 25);
        this.emotes = 
            { goldPooper: loadImage(`emotes/goldPooper24.png`) , 
             RIP: loadImage(`emotes/rip24.png`) }
        
        
    }
    addLocalChatMessage(message)
    {
        this.messages.push(new Message("localClient", message, 14))
    }
    addRemoteChatMessage(message)
    {
        this.messages.push(new Message("remoteClient", message, 14))
>>>>>>> Stashed changes
    }
    addChatMessage(message)
    {
        this.messages.push(message)
    }
<<<<<<< Updated upstream
    show()
=======
    activateInput()
    {
        // this.active = true;
        // this.input.elt.style.visibility = "visible";
        // this.input.elt.focus();
    }
    deactivateInput()
    {
        // this.active = false;
        // this.input.elt.style.visibility = "hidden";
        // this.input.elt.blur();
        // this.p5Input.text = this.input.elt.value;

    }
    inputClicked()
>>>>>>> Stashed changes
    {
        return mouseX > this.p5Input.x && mouseX < this.p5Input.x + this.p5Input.width &&
        mouseY > this.p5Input.y && mouseY < this.p5Input.y + this.p5Input.height;
    
    }
    focus()
    {
        if (this.active)
        {
            this.deactivateInput();
        }
        else
        {
            this.activateInput();
        }
    }
    draw()
    {

        fill(140, 140, 140, 255)
        rect(this.x, this.y, this.width, this.height)
<<<<<<< Updated upstream
        let startPos = this.y + this.height - this.padding - 30
=======
        // if (!this.active)
        // {
        //     this.p5Input.draw()
        // }
        this.p5Input.draw();
        let startPos = this.y + this.height - this.padding - 20
>>>>>>> Stashed changes
        let maxWidth = this.width - this.padding * 2 //max width of a line is the width of the textbox times the padding from both sides
        for (let index = this.messages.length - 1; index >= 0; index--) {
            const element = this.messages[index];
            if (startPos - this.y  - this.padding > 0)
            {
                fill(255)
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 
<<<<<<< Updated upstream
                let numberOfExtraLines = Math.floor(textWidth(element) / maxWidth)
                startPos -= this.text_size * numberOfExtraLines
                textSize(this.text_size)
                text(element, this.x + this.padding, startPos - this.padding, maxWidth)
                startPos -= this.messageOffset
=======

                // textLeading(element.fontSize) //makes space between lines consistent for multiline comments
                if (element.type === "localClient")
                {
                    push();
                    textLeading(element.fontSize + 2) //makes space between lines consistent for multiline comments

                    this.formatChatMessage(message, name, "#ff2020", "#FFFFFF", startPos, maxWidth, element.fontSize)
                    pop();
                }
                else if (element.type === "remoteClient")
                {
                    push();
                    textLeading(element.fontSize + 2) //makes space between lines consistent for multiline comments

                    this.formatChatMessage(message, name, "#2020ff", "#FFFFFF", startPos, maxWidth, element.fontSize)
                    pop();
                }
                else if (element.type === "admin")
                {
                    push();
                    textLeading(element.fontSize) //makes space between lines consistent for multiline comments

                    textSize(element.fontSize)

                    textStyle(BOLD)
                    textWrap(CHAR)
                    fill(255, 0, 0)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)
                    pop();


                }
                else if (element.type === "info")
                {
                    push();
                    textLeading(element.fontSize) //makes space between lines consistent for multiline comments
                    textSize(element.fontSize)
                    textStyle(ITALIC)
                    textWrap(CHAR)
                    fill(255)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)
                    pop();


                }

                // startPos -= this.messageOffset + element.fontSize//update start position for next loop
                startPos -= element.fontSize + this.messageOffset

>>>>>>> Stashed changes
            }
            else
            {
                //remove all remaining messages since they overflow
                this.removeChatMessages(index)
            }
        }
    }
    removeChatMessages(index)
    {
        this.messages.splice(0,index)
    }

}
