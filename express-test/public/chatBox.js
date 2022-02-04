
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
        this.messages.push(new Message("chat",message))
    }
    buildTimerEnd()
    {
        this.messages.push(new Message("admin","STARTING ATTACK PHASE"))
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
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 
                let numberOfExtraLines = Math.floor(textWidth(element.message) / maxWidth)
                startPos -= this.text_size * numberOfExtraLines
                if(element.type ==="chat")
                {
                    textStyle(NORMAL)
                    textSize(this.text_size)
                    fill(255)
                }
                else if(element.type ==="admin")
                {
                    textStyle(BOLD)
                    textSize(this.text_size)
                    fill(255,0,0)
                }

                text(element.message, this.x + this.padding, startPos - this.padding, maxWidth)
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
class Message{
    constructor(type,message){
        this.type = type
        this.message = message
    }
}