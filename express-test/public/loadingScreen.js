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
            if (!this.timerLightning.isFinished)
            {
                image(this.lightningGif,0,0,1000,580)
                this.timerLightning.tick();
            }
            else
            {
                image(this.staticGif,0,0,1000,580)
            }
            
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