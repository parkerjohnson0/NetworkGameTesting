class UserInterface {
    constructor(){
        this.buttons=[];
        this.roundText = new RoundText();
        this.playerControls=[];
        this.floatingText=[];
        this.towerPopup = new TowerPopup();
        this.nameBox = new NameBox(playWidth / 2, playHeight / 2, 400,50);
        this.chatBox = new ChatBox(playWidth + 100, 0, 300,580);
        this.gameOverBox = new GameOverBox(playWidth / 2, playHeight / 2, 400);
        // this.chatBox.input.elt.addEventListener("keydown", this.inputListener)
        console.log(document.cookie)
        this.commands = {
            soloGame : "!start",
            unmute : "!unmute",
            mute : "!mute"
        }
    }

    generateFloatingText(text, position, color){
        this.floatingText.push(new FloatingText(text, position, color));
    }

    chatListener(e)
    {
        // sendToMongo(score, playerName)
        socket.emit("gameOver", score)
        ui.sendMessage()
    }
    inputListener(e)
    {
        switch (e.key)
        {
            case "Enter":
                ui.sendMessage()
                break;
            default:
                ui.chatBox.input.text += e;
                break;
        }
    }

sendMessage()
{
    // let text = this.chatBox.input.elt.value.trim();
    // if (text)
    // {
    //     console.log(text);
    //     this.chatBox.input.elt.value = "" //reset input 
    //     let string = `${playerName}: ${text}`
    //     this.chatBox.addLocalChatMessage(string)
    //     socket.emit("chatMessage", string)
    // }
    let text = this.chatBox.input.text
    if (text)
    {
        console.log(text);
        this.chatBox.input.text = "" //reset input 
        this.chatBox.input.displayText = "" //reset input 
        let string = `${playerName}: ${text}`
        this.chatBox.addLocalChatMessage(string)
        if (!this.containsCommand(text)) //send only the text, without prepended name
        {
            socket.emit("chatMessage", string)
        }
        else
        {
            if (text == this.commands.soloGame)
            {
                socket.emit("soloGameStart", (response)=>{
                    if (response.response){
                        gold *= 2;
                    }
                });
            }
            else if (text == this.commands.unmute)
            {
                // sounds.forEach((sound)=>{
                //     sound.setVolume(0)
                // })
            }
            else if (text == this.commands.mute)
            {
                // sounds.forEach((sound)=>{
                //     sound.setVolume(0.1)
                // })
            }
            
        }
    }
}
    containsCommand(string)
    {
        for (let key in this.commands)
        {
            if (this.commands[key] == string)
            {
                return true;
            }
        }
        return false;
    }
    draw(){
        image(resources.backplate,playWidth,playHeight-180);

        //UI Buttons
        for (let button of this.buttons){
            button.draw();
        }
        // Player Controls
        for (let control of this.playerControls){
            control.draw();
        }


        // Wave Indicator
        push();
        fill(255);
        textAlign(CENTER);
        textSize(10);
        text(`WAVE \n${currRound}`, playWidth+75,480);
        pop();

        // Gold Count
        image(resources.coin,playWidth+10,playHeight-37);
        push();
        fill('#ffff55');
        textSize(18);
        text(gold,playWidth+42, playHeight-12);
        pop();

        // Lives
        image(resources.heart,playWidth+10,playHeight-67);
        push();
        fill('#ac3232');
        textSize(18);
        text(lives,playWidth+42, playHeight-42);
        pop();

        //Build Timer
        let sprite;
        if (buildTimer && buildTimer.time >=0) {
        sprite = ceil((buildTimer.time /180));
        sprite > 0 ? sprite -= 1 : null;
        }
        else {
            sprite = resources.clock.length-1;
        }
        image(resources.clock[sprite], playWidth, playHeight-125);
        this.roundText.draw();

        let textToRemove = [];
        for (let text of this.floatingText){
            push();
            textAlign(CENTER);
            textFont('Helvetica')
            text.draw();
            pop();
            if (text.alpha <=0) {
                textToRemove.push(text);
            }
        }
        this.floatingText = this.floatingText.filter(item => !textToRemove.includes(item));


        this.chatBox.draw();

        // Tower Info Popup
        this.towerPopup.draw();
    }


    promptForName()
    {
        let nameBox= select("#name_box_container")
        nameBox.elt.style.visibility = "visible"
        nameBox.elt.addEventListener("Sdown",this.nameBoxListener)
    }
    nameBoxListener(e)
    {
        switch (e.key)
        {
            case "Enter":
                let name = select("#name_text").elt.value.trim();
                // let nums = new Uint32Array(1)
                if (name && name != "")
                {
                    document.cookie = "name=" + name
                    playerName = name
                    this.style.visibility = "hidden"
                    socket.emit("newPlayerJoined", name)
                }
                socket.emit("requestBuildTimerStart")
                break;
            default:
                break;
        }
    }

    getPlayerName(cookie){
        let cookies = cookie.split(";")
        for (let i = 0; i < cookies.length; i++)
        {
            let nameValue = cookies[i].split("=")
            if (nameValue[0].trim() == "name")
            {
                playerName = nameValue[1]
                return playerName
            }
        }
        return ""
    }

}