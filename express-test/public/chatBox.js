class ChatBox
{
    // messages = [new Message("chat", "test: hello this is a single line comment",14), new Message("chat","test: hello this is a 2 line comment hello this is a 2 line comment  hello this is a 2 line comment",14),
    // new Message("chat","test: hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment",14),
    //     new Message("chat", "test: hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment  hello this is a 3 line comment hello this is a 3 line comment", 14),
    //     new Message("chat", "test: hello this is a single line comment",14)
    // ]
    messages = []
    messageOffset = 5//space between messages
    padding = 25 //space between edge of box and the text
    top_padding = 50
    // text_size = 14 
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // this.input = createInput("", "text")
        // this.input.elt["maxLength"] = 70
        // this.input.position(this.x + this.padding, -55, "relative")
        // this.input.parent("#game_container")
        // this.input.elt.style.visibility = "hidden";
        // this.input.style("font-family","SuperLegendBoy");
        // this.input.size(250, 25)
        this.active = false;
        this.input = new p5Input(this.x + this.padding, 530 , 250 , 25, 70);
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
    }
    greetPlayer(name)
    {
        this.messages.push(new Message("info", name + " has joined the game!", 14))
    }
    buildTimerEnd()
    {
        this.messages.push(new Message("admin", "STARTING ATTACK PHASE", 16))
    }

    blockedPath()
    {
        this.messages.push(new Message("admin", "Can not block path to base!", 14))
    }
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
    {
        return mouseX > this.input.x && mouseX < this.input.x + this.input.width &&
        mouseY > this.input.y && mouseY < this.input.y + this.input.height;
    
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
        this.input.draw();
        let startPos = this.y + this.height - this.padding - 20
        let maxWidth = this.width - this.padding * 2 //max width of a line is the width of the textbox times the padding from both sides
        for (let index = this.messages.length - 1; index >= 0; index--)
        {

            const element = this.messages[index];
            let message
            let name
            if (element.type === "localClient")
            {
                // push();
                name = element.message.split(":")[0]
                message = element.message.split(":")[1].trim()
                // this.formatChatMessage(message, "#ff2020","#FFFFFF",startPos,maxWidth)
                // textSize(element.fontSize)
                message = this.padMessage(name, element.fontSize) + message


            }
            else if (element.type === "remoteClient")
            {
                // push();

                name = element.message.split(":")[0]
                message = element.message.split(":")[1].trim()
                // this.formatChatMessage(message, "#2020ff","#FFFFFF",startPos,maxWidth)
                // textSize(element.fontSize)
                message = this.padMessage(name, element.fontSize) + message


            }
            else if (element.type === "admin")
            {
                message = element.message
            }
            else if (element.type === "info")
            {
                message = element.message
            }

            push(); // text size affects textWidth so do that first
            textSize(element.fontSize)
            let numberOfExtraLines
            let numOfEmotes
            if ((element.type === "remoteClient" || element.type ==="localClient") && (numOfEmotes = this.numberOfEmotes(message)))
            {
                let remove = this.removeEmotesFromMessage(message)
                let messageWidth = textWidth(remove) + 16 * numOfEmotes
                numberOfExtraLines = Math.floor(messageWidth / maxWidth)
            }
            else
            {
                numberOfExtraLines = Math.floor(textWidth(message) / maxWidth)
            }
            pop();
            // console.log(numberOfExtraLines)
            let test = textWidth("    ")
            startPos -= element.fontSize * numberOfExtraLines
            // pop();
            if (startPos - this.y - this.top_padding > 0) //only show messages if it is not going to be drawn outside of the box
            {
                //find amount of lines comment will take up. change start pos of comment to be higher on the screen 

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

            }
            else
            {
                //remove all remaining messages since they overflow
                this.removeChatMessages(index)
            }
        }
        // pop();
        // push();

        image(resources.chatOverlay, this.x, this.y)
    }
    removeChatMessages(index)
    {
        this.messages.splice(0, index)
    }
    formatChatMessage(content, name, nameColor, contentColor, startPos, maxWidth, fontSize)
    {
        //message format "username: content"
        // let name = message.split(":")[0]
        // let content = ": " + message.split(":")[1]
        // push();
        textSize(fontSize)
        textStyle(BOLD)
        textWrap(CHAR)

        fill(nameColor)
        text(name, this.x + this.padding, startPos - fontSize, maxWidth)
        // let currWidth = textWidth(name)
        let colonString = ":"
        fill(contentColor)
        text(colonString, this.x + this.padding + textWidth(name), startPos - fontSize, maxWidth)
        // currWidth += textWidth(colonString)
        textStyle(NORMAL)
        // message = this.padMessage(name) + message
        if (this.containsEmote(content)) //replace with containsEmote call
        {
            let emoteTest = this.emoteReplace(content);
            // let stringOffset = 16; //emote size
            let leadingWhiteSpace = emoteTest.substrings.filter(x => x == "").join(" ") + " "
            // // emoteTest.substrings = emoteTest.substrings.filter(x => x != "") //filter out leading whitespace for name and colon
            // text(leadingWhiteSpace, this.x + this.padding + textWidth(colonString), startPos - fontSize, maxWidth)
            // let currWidth = textWidth(leadingWhiteSpace) + textWidth(colonString)
            // let stringOffset = textWidth(leadingWhiteSpace) + textWidth(colonString + " ")
            let emoteLessMessage = emoteTest.substrings.filter(x => x != "").join(" ")
            let commaSeparated = emoteTest.substrings.filter(x => x != "").join(",") //used to build the emote mask

            text(leadingWhiteSpace + emoteLessMessage, this.x + this.padding, startPos - fontSize, maxWidth)
            let message = emoteLessMessage;
            let wordArray = commaSeparated.split(",")

            let xOffset = textWidth(leadingWhiteSpace) % maxWidth 
            let messageLength = textWidth(leadingWhiteSpace)
            let emoteIndex = 0
            for (let i = 0; i < wordArray.length; i++)
            {


                // let messageLength = textWidth(message)
                let yOffset = 0
                // let xOffset = (messageLength + textWidth(leadingWhiteSpace)) % maxWidth 
                let lines

                if ((lines = Math.floor(messageLength/ maxWidth)) > 0)
                {
                    yOffset = lines * fontSize
                }
                if (wordArray[i] == "     ")
                {
                    let emoteKey = emoteTest.emotes[emoteIndex++]

                    image(this.emotes[emoteKey], (this.x + this.padding + xOffset), startPos - fontSize * 2 + yOffset - 4)
                }
                messageLength += textWidth(wordArray[i]) + textWidth(" ")
                xOffset = messageLength % maxWidth
                // image(this.goldPooper, this.x + this.padding + xOffset, startPos - fontSize + yOffset)

            }
            // for (let i = 0; i < emoteTest.substrings.length; i++)
            // {
            //     if (emoteTest.substrings[i] == " ")
            //     {
            //         image(this.goldPooper, this.x + this.padding + stringOffset, startPos - fontSize)
            //         stringOffset += this.goldPooper.width + textWidth(" ");
            //         currWidth += 32 // leading and trailing space
            //     }
            //     else
            //     {
            //         let substring = emoteTest.substrings[i]
            //         text(substring, this.x + this.padding + stringOffset, startPos - fontSize, maxWidth)
            //         stringOffset += textWidth(emoteTest.substrings[i] + " ")
            //         currWidth += textWidth(emoteTest.substrings[i])
            //     }
            // }
        }
        else
        {
            text(content, this.x + this.padding, startPos - fontSize, maxWidth)
        }

        // text(content, this.x + this.padding, startPos - fontSize, maxWidth)
        // pop();
    }
    padMessage(name, fontSize)
    {
        name += ":"
        let padString = ""
        let padWidth = ""
        let nameWidth = ""
        push();
        textSize(fontSize)
        if (textWidth(padString) < textWidth(name)) 
        {
            padWidth = textWidth(padString)
            nameWidth = textWidth(name)
            while (padWidth < nameWidth + 3)
            {
                padString += " "
                padWidth = textWidth(padString)
                nameWidth = textWidth(name)
            }
            // padString += " "
        }
        pop();
        return padString
    }
    emoteReplace(content)
    {
        let substrings = content.split(" ")
        let emotes = []
        let keys = Object.keys(this.emotes)
        // if (substrings.includes('goldPooper'))
        // {
        //     emotes.push('goldPooper')
        // }
        for (let index = 0; index < substrings.length; index++)
        {
            const element = substrings[index];
            if (keys.includes(element))
            {
                emotes.push(element)
                substrings[index] = "     "
            }
        }
        return { "substrings": substrings, "emotes": emotes }
    }
    containsEmote(message)
    {
        let s = message.split(" ")
        let keys = Object.keys(this.emotes)
        return s.some(x => keys.some(y => y == x))
    }
    numberOfEmotes(message)
    {
        let s = message.trim().split(" ")
        let keys = Object.keys(this.emotes)
        return s.filter(x => keys.includes(x)).length
    }
    removeEmotesFromMessage(message)
    {
        let s = message.split(" ")
        let keys = Object.keys(this.emotes)
        s.forEach((x, index) => 
        {
            if (keys.includes(x))
            {
                s[index] = "     "
            }
        })
        return s.join(" ");
    }
}
class Message
{
    constructor(type, message, fontSize)
    {
        this.type = type
        this.message = message
        this.fontSize = fontSize
    }
}