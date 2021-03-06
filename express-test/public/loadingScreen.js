class LoadingScreen
{
    static lightningGif;
    static staticGif;
    static timerLightning = new Timer(2.4, true);
    static showing = false;
    static thunderStruck = false;
    static draw()
    {
        if (this.showing)
        {
            push();
            if (!this.thunderStruck && this.timerLightning.time < 30)
            {
                if (Howler.ctx.state != "suspended")
                {
                    playSound(sounds.thunder);
                }
                this.thunderStruck = true;

            }
            if (!this.timerLightning.isFinished)
            {
                image(this.lightningGif, 0, 0, 1000, 580)
                this.timerLightning.tick();
            }
            else
            {
                image(this.staticGif, 0, 0, 1000, 580)
                noStroke();
            }
            pop();

        }
    }
    static start()
    {
        this.showing = true;
        this.timerLightning.start();
    }
    static stop()
    {
        this.showing = false;
    }
}