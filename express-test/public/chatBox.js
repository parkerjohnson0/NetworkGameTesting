
class ChatBox
{
    // messages = ["drlee: hey wassup", "drlee: nothing","drlee: nothingasdf asdf asdf asdf wewe asdgasdg adfg ", "drlee: nothing","drlee: nothing","drlee: nothingasdf asdf asdf asdf wewe","drlee: nothing","drlee: nothingasdf asdf asdf asdf wewe"]
    messages = []
    messageOffset = 25
    padding = 15
    text_size = 12
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = createInput("", "text")
        this.input.position(-200 + this.padding, 275 - this.padding, "relative")
        this.input.size(200, 15)



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
        let maxWidth = this.width - this.padding * 2
        for (let index = this.messages.length - 1; index >= 0; index--) {
            const element = this.messages[index];
            if (startPos - this.y  - this.padding > 0)
            {
                fill(255)
                if (textWidth(element) > maxWidth)
                {
                    startPos -=this.text_size
                }
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
