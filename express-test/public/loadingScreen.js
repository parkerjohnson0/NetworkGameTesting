class LoadingScreen
{
    static lightningGif;
    static staticGif;
    static timerLightning = new Timer(5);
    static showing = false;
    static draw()
    {

        if (this.showing)
        {
            push();

            if (!this.timerLightning.isFinished)
            {
                image(this.lightningGif, 0, 0, 1000, 580)
                this.timerLightning.tick();
            }
            else
            {
                image(this.staticGif, 0, 0, 1000, 580)
                noStroke();
                text("Press enter lol", 400, 290)
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