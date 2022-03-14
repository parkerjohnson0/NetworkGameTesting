
class GameOverBox
{
    constructor(x,y,width)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 100;
        // this.results = [
        //     { "score": 285, "name": "loop_daddy" },
        //     { "score": 327, "name": "dooper" }];
        this.results = [
            { "score": 285, "name": "loop_daddy" }];
        this.round = null;
        this.padding = 10;
    }
    draw()
    {
        push();
        fill(140, 140, 140, 255)
        rectMode(CENTER)
        rect(this.x, this.y, this.width, this.height)
        fill(255)
        text("GAME OVER", this.x - textWidth("GAME OVER") / 2, this.y - (this.height / 2) + textSize() + this.padding);
        let offset = 25
        for (var i = this.results.length - 1; i >= 0; i--)
        {
            let string = this.results[i].name + ": " + this.results[i].score;
            text(string, this.x - textWidth(string) / 2, this.y + ((this.height / 3)) - offset);
            offset += 15;
        }
        let string = "CLICK OR PRESS ENTER TO PLAY AGAIN";
        text(string, this.x - textWidth(string) / 2, this.y + (this.height / 2) - this.padding);
        pop();
    }
    setResults(results)
    {
        this.height = 75 + (results.length * 25);
        this.results = results;
    }
}