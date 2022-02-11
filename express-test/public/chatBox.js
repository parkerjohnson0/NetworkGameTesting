
class ChatBox
{
    // messages = [new Message("chat", "test: hello this is a single line comment",14), new Message("chat","test: hello this is a 2 line comment hello this is a 2 line comment  hello this is a 2 line comment",14),
    // new Message("chat","test: hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment",14),
    //     new Message("chat", "test: hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment", 14),
    //     new Message("chat", "test: hello this is a single line comment",14)
    // ]
    messages = []
    messageOffset = 5//space between messages
    padding = 15 //space between edge of box and the text
    text_size = 14 
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = createInput("", "text")
        this.input.elt["maxLength"] = 70
        this.input.position(-200 + this.padding, 275 - this.padding, "relative")
        this.input.size(200, 15)
        this.button = createButton("Chat")
        this.button.position(-200 + this.padding, 275 - this.padding, "relative")
    }
    addLocalChatMessage(message)
    {
        this.messages.push(new Message("localClient",message,16))
    }
    addRemoteChatMessage(message)
    {
        this.messages.push(new Message("remoteClient",message,16))
    }
    greetPlayer(name)
    {
        this.messages.push(new Message("info", name + " has joined the game!",18))
    }
    buildTimerEnd()
    {
        this.messages.push(new Message("admin","STARTING ATTACK PHASE",16))
    }
    show()
    {
        fill(140, 140, 140, 255)
        rect(this.x, this.y, this.width, this.height)
        let startPos = this.y + this.height - this.padding - 30
        let maxWidth = this.width - this.padding * 2 //max width of a line is the width of the textbox times the padding from both sides
        for (let index = this.messages.length - 1; index >= 0; index--)
        {

            const element = this.messages[index];
            let numberOfExtraLines = Math.floor(textWidth(element.message) / maxWidth)
            startPos -= element.fontSize * numberOfExtraLines
            if (startPos - this.y  - this.padding > 0) //only show messages if it is not going to be drawn outside of the box
            {
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 

                textLeading(element.fontSize) //makes space between lines consistent for multiline comments
                if(element.type ==="localClient")
                {
                    this.formatChatMessage(element, "#ff2020","#FFFFFF",startPos,maxWidth)


                }
                else if(element.type ==="remoteClient")
                {
                    this.formatChatMessage(element, "#2020ff","#FFFFFF",startPos,maxWidth)
                }
                else if(element.type ==="admin")
                {
                    textSize(element.fontSize)

                    textStyle(BOLD)
                    textWrap(CHAR)
                    fill(255, 0, 0)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)
                    
                }
                else if(element.type ==="info")
                {
                    textSize(element.fontSize)
                    textStyle(ITALIC)
                    textWrap(CHAR)
                    fill(255)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)

                }
                
                // startPos -= this.messageOffset + element.fontSize//update start position for next loop
                startPos -= element.fontSize + this.messageOffset

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
    formatChatMessage(element,nameColor, messageColor,startPos,maxWidth)
    {
        //message format "username: content"
        let name = element.message.split(":")[0]
        let message = ": " + element.message.split(":")[1].trim()
        textSize(element.fontSize)
        textStyle(BOLD)
        textWrap(CHAR)

        fill(nameColor)
        text(name, this.x + this.padding, startPos - element.fontSize, maxWidth)
        fill(messageColor)
        textStyle(NORMAL)
        message = this.padMessage(name) + message
        text(message, this.x + this.padding, startPos - element.fontSize, maxWidth)
    }
    padMessage(name)
    {
        let padString = ""
        while (textWidth(padString) < textWidth(name))
        {
            padString += " "
        }
        return padString
    }

}
class Message{
    constructor(type,message,fontSize){
        this.type = type
        this.message = message
        this.fontSize = fontSize
    }
}