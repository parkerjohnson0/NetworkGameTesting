
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
        this.input.position(-200 + this.padding, 275 - this.padding, "relative")
        this.input.size(200, 15)
        this.button = createButton("Chat")
        this.button.position(-200 + this.padding, 275 - this.padding, "relative")
    }
    addChatMessage(message)
    {
        this.messages.push(message)
    }
    show()
    {
        fill(140, 140, 140, 255)
        rect(this.x, this.y, this.width, this.height)
        let startPos = this.y + this.height - this.padding - 30
        let maxWidth = this.width - this.padding * 2 //max width of a line is the width of the textbox times the padding from both sides
        for (let index = this.messages.length - 1; index >= 0; index--) {
            const element = this.messages[index];
            if (startPos - this.y  - this.padding > 0)
            {
                fill(255)
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 
                let numberOfExtraLines = Math.floor(textWidth(element) / maxWidth)
                startPos -= this.text_size * numberOfExtraLines
                textSize(this.text_size)
                text(element, this.x + this.padding, startPos - this.padding, maxWidth)
                startPos -= this.messageOffset
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
