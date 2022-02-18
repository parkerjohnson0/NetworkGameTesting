
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
        this.input.position(this.x + this.padding, -40, "relative")
        this.input.parent("#game_container")
        this.input.size(270, 25)
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
        this.messages.push(new Message("info", name + " has joined the game!",16))
    }
    buildTimerEnd()
    {
        this.messages.push(new Message("admin","STARTING ATTACK PHASE",16))
    }

    blockedPath(){
        this.messages.push(new Message("admin","Can not block path to base!",16))
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
            let message
            let name
            if (element.type === "localClient" )
            {
                push();
                name = element.message.split(":")[0]
                message = ": " + element.message.split(":")[1].trim()
                // this.formatChatMessage(message, "#ff2020","#FFFFFF",startPos,maxWidth)
                textSize(element.fontSize)
                message = this.padMessage(name) + message

                
            }
            else if (element.type === "remoteClient")
            {
                push();

                name = element.message.split(":")[0]
                 message = ": " + element.message.split(":")[1].trim()
                // this.formatChatMessage(message, "#2020ff","#FFFFFF",startPos,maxWidth)
                textSize(element.fontSize)
                message = this.padMessage(name) + message
                

            }
            let numberOfExtraLines = Math.floor(textWidth(message) / maxWidth)

            console.log(numberOfExtraLines)
            startPos -= element.fontSize * numberOfExtraLines
            // pop();
            if (startPos - this.y  - this.padding > 0) //only show messages if it is not going to be drawn outside of the box
            {
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 

                textLeading(element.fontSize) //makes space between lines consistent for multiline comments
                if(element.type ==="localClient")
                {
                     this.formatChatMessage(message, name,"#ff2020","#FFFFFF",startPos,maxWidth)
                     pop();
                }
                else if(element.type ==="remoteClient")
                {
                    this.formatChatMessage(message, name, "#2020ff", "#FFFFFF", startPos, maxWidth)
                    pop();
                }
                else if(element.type ==="admin")
                {
                    push();
                    textSize(element.fontSize)

                    textStyle(BOLD)
                    textWrap(WORD)
                    fill(255, 0, 0)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)
                    pop();

                    
                }
                else if(element.type ==="info")
                {
                    push();
                    textSize(element.fontSize)
                    textStyle(ITALIC)
                    textWrap(WORD)
                    fill(255)
                    text(element.message, this.x + this.padding, startPos - element.fontSize, maxWidth)
                    pop();


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
        // pop();
        // push();


    }
    removeChatMessages(index)
    {
        this.messages.splice(0,index)
    }
    formatChatMessage(content,name,nameColor, contentColor,startPos,maxWidth)
    {
        //message format "username: content"
        // let name = message.split(":")[0]
        // let content = ": " + message.split(":")[1]
        // push();
        // textSize(element.fontSize)
        textStyle(BOLD)
        textWrap(WORD)

        fill(nameColor)
        text(name, this.x + this.padding, startPos - textSize(), maxWidth)
        fill(contentColor)
        textStyle(NORMAL)
        // message = this.padMessage(name) + message
        text(content, this.x + this.padding, startPos - textSize(), maxWidth)
        // pop();
    }
    padMessage(name)
    {
        let padString = ""
        if (textWidth(padString) < textWidth(name)) 
        {
            while (textWidth(padString) < textWidth(name))
            {
                padString += " "
            }
            // padString += " "
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