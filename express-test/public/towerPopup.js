class TowerPopup{
    
    constructor(){
        this.position = createVector(0,0);
        this.name;
        this.range;
        this.damage;
        this.rof;
        this.rank;
        this.upgradeCost;
        this.visible = false;
    }

    setTower(tower){
        this.name = tower.name;
        this.damage = tower.damage;
        this.range = tower.range;
        this.rank = tower.rank;
        this.rof = (1/tower.refire).toFixed(2);
        this.upgradeCost = tower.currUpgradeCost;
    }

    show(){
        this.visible = true;
    }

    hide(){
        this.visible = false;
    }

    draw(){
        this.position = createVector(mouseX+50, mouseY+25);
        if (this.visible){
            push();
            fill(255);
            //rect(this.position.x,this.position.y,200,130);
            image(resources.popup, this.position.x,this.position.y);
            fill(0);
            textSize(8);
            text(`Type: ${this.name} (Rank ${this.rank})`,this.position.x+20,this.position.y+27);
            text(`Damage: ${this.damage}`,this.position.x+20,this.position.y+47);
            text(`RoF: ${this.rof} / sec`,this.position.x+20,this.position.y+67);
            text(`Range: ${this.range}m`,this.position.x+20,this.position.y+87);
            text(`Upgrade Cost: ${this.upgradeCost} gold`,this.position.x+20,this.position.y+107);
            pop();
        }
    }
}