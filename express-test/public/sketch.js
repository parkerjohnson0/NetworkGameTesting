/// <reference path="TSDef/p5.global-mode.d.ts" />

"use strict";


let currFrame = 0
let gameMap;
let towers = [];
let canBuild = true;

let gameIsOver = false;
let enemiesCanSpawn = false;
let IsAttackPhase = false;
let buildTimerEndRequested = false;
let timerCanStart
let IsStarted = false;

let testEnemies = [];
let enemyCount = 10;
let enemyBonusStats = { hp: 0, speed: 0 };
let goal;
let startL;
let startR;
let buildTimer;
let currRound = 1;
// let loadingAnimation = true;
let p2mousePosition;
let towerID = 0;

let playWidth = 600;
let playHeight = 580;

let loadingGif;
let resources = {};
resources.towers = [];
let towerSprites;
let tileSprites;
let zombieSprites;
let eyeballSprite;
let caveSprites;
let clockSprites;

let upgradeSprites;
let destroySprites;

let poisonSprites;
let magicSprites;
let iceSprites;
let fireSprites;
let fireTower;

let ui;
let costs = [30, 50, 40, 45];

let gold = 250;
let lives = 30;
let towerToBuild = -5;

let selectedTower;

let socket
let socketID = 0 //save ID so that client player can be retrieved from playerslist after a disconnect. band aid for bad design decision right now
let gameInstanceID = 0
// let canv
let playerName = "";

let chatBox;
let randSeed;

let gfx;
let sounds = []
let clientEnemiesKilled = 0;

let timestep = 1000 / 60;
function preload()
{
  eyeballSprite = loadImage(`assets/eyeball_spritesheet.png`);
  towerSprites = loadImage(`assets/tower_spritesheet.png`);
  fireTower = loadImage(`assets/tower4_spritesheet.png`);
  tileSprites = loadImage(`assets/tile_spritesheet.png`);
  resources.cursor = loadImage(`assets/hand.png`);
  resources.coin = loadImage(`assets/coin.png`);
  clockSprites = loadImage(`assets/clock_spritesheet.png`);
  resources.towers.push(loadImage(`assets/tower1.png`));
  resources.towers.push(loadImage(`assets/tower2.png`));
  resources.towers.push(loadImage(`assets/tower3.png`));
  zombieSprites = loadImage(`assets/zombie_spritesheet.png`);
  caveSprites = loadImage(`assets/cave_spritesheet.png`);
  upgradeSprites = loadImage(`assets/upgrade_spritesheet.png`);
  resources.hammer = loadImage(`assets/upgrade_sm.png`);
  destroySprites = loadImage(`assets/destroy_spritesheet.png`);
  resources.cross = loadImage(`assets/destroy_sm.png`);
  poisonSprites = loadImage(`assets/poison_spritesheet.png`);
  magicSprites = loadImage(`assets/magic_spritesheet.png`);
  iceSprites = loadImage(`assets/ice_spritesheet.png`);
  fireSprites = loadImage(`assets/fire_spritesheet.png`);
  resources.base = loadImage(`assets/base.png`);
  resources.heart = loadImage(`assets/heart.png`);
  resources.popup = loadImage(`assets/popup_frame.png`);
  resources.backplate = loadImage(`assets/ui_backplate.png`);
  resources.chatOverlay = loadImage(`assets/chat_overlay.png`)
  resources.font = loadFont('assets/SuperLegendBoy.ttf');
  sounds.iceTower = new Howl({src:`audio/ice3.wav`, volume:0.08})
  sounds.magicTower = new Howl({src:`audio/magic.wav`, volume:0.1})
  sounds.fireTower = new Howl({src:`audio/fire.wav`, volume:0.1})
  sounds.gasTower = new Howl({src:`audio/gas2.wav`, volume:0.08})
  sounds.gold = new Howl({src:`audio/coin.wav`, volume:0.1})
  sounds.upgrade = new Howl({src:`audio/upgrade.wav`, volume:0.1})
  sounds.destroy = new Howl({src:`audio/destroy3.wav`, volume:0.1})
  sounds.damage = new Howl({ src: `audio/damage.wav`, volume: 0.1 })
  sounds.thunder = new Howl({
    src: `audio/thunder.wav`,
    volume: 0.07,
  })
  
  // loadingGif = loadImage(`assets/test.gif`)
  LoadingScreen.lightningGif = loadImage(`assets/titlescreen_anim1.gif`)
  LoadingScreen.staticGif = loadImage(`assets/titlescreen_anim2.gif`);
}
function restart()
{
  towerID = 0;
  canBuild = true;
  IsStarted = false;
  enemiesCanSpawn = false;
  IsAttackPhase = false;
  buildTimerEndRequested = false;
  buildTimer = null;
  clientEnemiesKilled = 0;
  gameIsOver = false;
  p2mousePosition = new Mouse();
  towers = [];
  testEnemies = [];
  ui.chatBox.messages = [];
  gold = 250;
  lives = 30;
  currRound = 1;
  towerToBuild = -5;
  disconnect(); //disconnect socket
  socketID = 0 //save ID so that client player can be retrieved from playerslist after a disconnect. band aid for bad design decision right now
  gameInstanceID = 0
  enemyBonusStats = { hp: 0, speed: 0 };
  setupSocket();
}
function setup()
{
  frameRate(60)
  gfx = createGraphics(playWidth, playHeight);
  gfx.background(0, 0, 0)
  ui = new UserInterface();
  ui.roundText.setText("Build Phase");
  // p2mousePosition = createVector(-50, 50);
  p2mousePosition = new Mouse();
  textFont(resources.font)

  //prep all assets
  resources.eyeball = generateSprites(eyeballSprite,30,30,true);
  resources.towerButtons = generateSprites(towerSprites, 100, 100);
  resources.clock = generateSprites(clockSprites, 50, 50, true);
  resources.tiles = generateSprites(tileSprites, 20, 20, true);
  resources.zombieSprites = generateSprites(zombieSprites, 20, 20, true);
  resources.caveSprites = generateSprites(caveSprites, 20, 20, true);
  resources.upgrade = generateSprites(upgradeSprites, 50, 50, true);
  resources.destroy = generateSprites(destroySprites, 50, 50, true);
  resources.poison = generateSprites(poisonSprites, 24, 24, true);
  resources.magic = generateSprites(magicSprites, 24, 24, true);
  resources.ice = generateSprites(iceSprites, 24, 24, true);
  resources.fire = generateSprites(fireSprites, 9, 8, true);
  resources.fireTower = generateSprites(fireTower, 20, 25, true);
  // sounds.iceTower.setVolume(0.08);
  // sounds.gold.setVolume(0.1);
  // sounds.upgrade.setVolume(0.1);
  // sounds.magicTower.setVolume(0.1);
  // sounds.fireTower.setVolume(0.1);
  // sounds.gasTower.setVolume(0.08);
  // sounds.destroy.setVolume(0.1);
  // sounds.damage.setVolume(0.1);



  for (let i = 0; i < resources.towerButtons.length; i++)
  {
    ui.buttons.push(new Button(resources.towerButtons[i], costs[i], i, playWidth, i * 100));
  }

  ui.playerControls.push(new Button(resources.upgrade, 0, -1, playWidth + 50, 405));
  ui.playerControls.push(new Button(resources.destroy, 0, -2, playWidth + 1, 405));

  let canv = createCanvas(playWidth + 400, playHeight);
  // canv.parent("game-placeholder")
  canv.elt.addEventListener("contextmenu", (e) => e.preventDefault());
  background(0);
  stroke(0, 255, 0);
  noFill();
  fill(0);

  //Generate Map
  let rows = 29;
  let cols = 30;
  gameMap = new Map(rows, cols);
  LoadingScreen.start();
  // gameMap.generate(); // Single Player

  //Mark Enemy Spawn and Enemy Goal locations as unbuildable
  // startL = gameMap.tileMap[11][0];
  // startR = gameMap.tileMap[11][cols-1];
  // goal = gameMap.tileMap[16][16];

  // for (let space of gameMap.tileMap){
  //   for (let tile of space){
  //   if (tile.r >= 15 && tile.r <= 17){
  //     if (tile.c >= 15 && tile.c <= 17){
  //       tile.outOfBounds = true;
  //     }
  //   }
  //   }
  // }
  //goal.outOfBounds = true;

  //Set Build Timer
  // startBuild(); // Single Player
  //   ui.roundText.start(); // Single Player
}

function generateSprites(spritesheet, spriteWidth, spriteHeight, singleArray)
{
  let r = spritesheet.height / spriteHeight;
  let c = spritesheet.width / spriteWidth;
  let sprites = singleArray ? [] : Array.from({ length: r }, () => Array(c).fill(0));
  for (let i = 0; i < r; i++)
  {
    for (let j = 0; j < c; j++)
    {

      if (singleArray)
      {
        sprites.push(spritesheet.get(j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight));
        continue;
      }
      sprites[i][j] = (spritesheet.get(j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight));
    }
  }
  return sprites;
}
function keyTyped()
{
  if (gameIsOver)
  {
    restart();
  }
  if (LoadingScreen.showing && LoadingScreen.timerLightning.isFinished)
  {
    LoadingScreen.stop();
    setupSocket();
  }
  if (ui.chatBox.input.focused && key === "Enter")
  {
    ui.sendMessage();
  }
  else if (ui.chatBox.input.focused && key !== "Delete")
  {
    ui.chatBox.input.handleKey(key)
  }
  else if (ui.nameBox.input.focused && key === "Enter")
  {
    playerName = ui.nameBox.input.text;
    if (playerName)
    {
        
      document.cookie = "name=" + playerName
      socket.emit("newPlayerJoined", playerName)
      socket.emit("requestBuildTimerStart")
      ui.nameBox.disable();
    }
      
  }
  else if (ui.nameBox.input.focused && key !== "Delete")
  {
    ui.nameBox.input.handleKey(key)
  }
  return false;
}

function keyPressed()
{
  if (gameIsOver)
  {
    restart();
  }
  selectedTower = null;
  // if (ui.chatBox.p5Input.focused && keyCode === 8) //backspace
  // {
  //   ui.chatBox.p5Input.removeText();
  // }
  if (mouseX < playWidth + 100 && mouseY < playHeight && !ui.chatBox.input.focused && !ui.nameBox.isEnabled)
  {

    switch (keyCode)
    {
      // 1 key
      case 49:
        towerToBuild = 0;
        break;
      // 2 key
      case 50:
        towerToBuild = 1;
        break;
      // 3 key
      case 51:
        towerToBuild = 2;
        break;
      // 4 key
      case 52:
        towerToBuild = 3;
        break;
      // ESC key
      case 27:
        towerToBuild = -5;
        break;
      // U key
      case 85:
        towerToBuild = -1;
        break;
      // D key
      case 68:
        towerToBuild = -2;
        break;
      default:
        break;
    }
  }
}
function mouseReleased()
{
  if (mouseButton == RIGHT)
  {
    towerToBuild = -5;
    return;
  }
}
function mouseClicked()
{
  if (LoadingScreen.showing && LoadingScreen.timerLightning.isFinished)
  {
    LoadingScreen.stop();
    setupSocket();
  }
  selectedTower = null;
  if (ui.chatBox.inputClicked() && !ui.nameBox.isEnabled)
  {
    ui.chatBox.input.focus();
  }
  else
  {
    ui.chatBox.input.unfocus();
  }
  if (ui.nameBox.inputClicked())
  {
    ui.nameBox.input.focus();
  }
  else
  {
    ui.nameBox.input.unfocus();
  }

  // Clicking Tower Buttons
  if ((mouseX > playWidth && mouseX < width && mouseY > 0 && mouseY < playHeight) && !ui.nameBox.isEnabled)
  {
    ui.towerPopup.hide();
    for (let button of ui.buttons)
    {
      if ((mouseX >= button.position.x) && (mouseX <= button.position.x + 100))
      {
        if ((mouseY >= button.position.y) && (mouseY <= button.position.y + 100))
        {
          towerToBuild = button.identifier;
        }
      }
    }

    // Clicking Upgrade/Destroy
    for (let control of ui.playerControls)
    {
      if ((mouseX >= control.position.x) && (mouseX <= control.position.x + 50))
      {
        if ((mouseY >= control.position.y) && (mouseY <= control.position.y + 50))
        {
          towerToBuild = control.identifier;
        }
      }
    }

    return false;
  }

  // Building Towers
  if ((mouseX > 0 && mouseX < playWidth && mouseY > 0 && mouseY < playHeight) && (canBuild) && towerToBuild >= 0)
  {
    ui.towerPopup.hide();
    // Check if building in this location would block enemies from pathing to goal
    let tile = gameMap.getTile();
    // console.log(tile)
    if (tile && tile.outOfBounds == false)
    {
      tile.isPathable = false;
      // Build makes goal unpathable
      if (gameMap.navChecker.findPath(startL, goal).length < 1 || gameMap.navChecker.findPath(startR, goal).length < 1)
      {
        tile.isPathable = true;
        ui.chatBox.blockedPath();
      }
      else
      {
        if (gold >= ui.buttons[towerToBuild].cost)
        {
          let tower
          switch (towerToBuild)
          {
            case 0:
              tower = new Tower(tile.position.x + gameMap.tileWidth / 2, tile.position.y + gameMap.tileWidth / 2, "p1", tile.r, tile.c, ui.buttons[towerToBuild].cost, towerID)
              break;
            case 1:
              tower = new Tower2(tile.position.x + gameMap.tileWidth / 2, tile.position.y + gameMap.tileWidth / 2, "p1", tile.r, tile.c, ui.buttons[towerToBuild].cost, towerID)
              break;
            case 2:
              tower = new Tower3(tile.position.x + gameMap.tileWidth / 2, tile.position.y + gameMap.tileWidth / 2, "p1", tile.r, tile.c, ui.buttons[towerToBuild].cost, towerID)
              break;
            case 3:
              tower = new Tower4(tile.position.x + gameMap.tileWidth / 2, tile.position.y + gameMap.tileWidth / 2, "p1", tile.r, tile.c, ui.buttons[towerToBuild].cost, towerID)
              break;
            default:
              break;
          }
          towers.push(tower)
          socket.emit("towerData", {
            "id": tower.id,
            "name": tower.name,
            "x": tower.position.x,
            "y": tower.position.y,
            "row": tower.row,
            "col": tower.col,
            "cost": ui.buttons[towerToBuild].cost
          })
          gold -= ui.buttons[towerToBuild].cost;
          towerID += 1;
        }
        else
        {
          tile.isPathable = true;
        }
      }
    }

    // prevent default
    return false;
  }

  if ((mouseX > 0 && mouseX < playWidth && mouseY > 0 && mouseY < playHeight))
  {
    // click to upgrade Tower
    let currTower;
    if (towerToBuild == -1)
    {
      for (let tower of towers)
      {
        if (tower.owner == "p1")
        {
          if (mouseX >= tower.position.x - 15 && mouseX <= tower.position.x + 15 && mouseY >= tower.position.y - 15 && mouseY <= tower.position.y + 15)
          {
            currTower = tower;
          }
        }
      }
      if (currTower && gold >= currTower.currUpgradeCost && currTower.rank < currTower.maxRank)
      {
        gold -= currTower.currUpgradeCost;
        currTower.upgrade();
        playSound(sounds.upgrade)
        socket.emit("towerUpgrade", currTower.id);
        ui.generateFloatingText(`Rank ???`, currTower.position, color(0, 225, 0, 255));
      }
    }

    //Destroy Tower
    if (towerToBuild == -2)
    {
      for (let tower of towers)
      {
        if (tower.owner == "p1")
        {
          if (mouseX >= tower.position.x - 15 && mouseX <= tower.position.x + 15 && mouseY >= tower.position.y - 15 && mouseY <= tower.position.y + 15)
          {
            currTower = tower;
          }
        }
      }
      if (currTower)
      {
        ui.generateFloatingText(`+${floor(currTower.totalSpent / 2)} gold`, currTower.position, color(255, 255, 0, 255));
        gold += floor(currTower.totalSpent / 2);
        gameMap.tileMap[currTower.row][currTower.col].isPathable = true;
        currTower.rank = -1;
        socket.emit("towerDestroy", currTower.id)
        playSound(sounds.destroy);
      }
    }


    // prevent default
    return false;
  }
}

function onMouseHover()
{
  let currTower;
  if (towerToBuild <= -1)
  {
    for (let tower of towers)
    {
      if (tower.owner == "p1")
      {
        if (mouseX >= tower.position.x - 15 && mouseX <= tower.position.x + 15 && mouseY >= tower.position.y - 15 && mouseY <= tower.position.y + 15)
        {
          currTower = tower;
        }
      }
      if (currTower)
      {
        selectedTower = currTower;
        ui.towerPopup.setTower(selectedTower);
        ui.towerPopup.show();
      }
      else
      {
        ui.towerPopup.hide();
        selectedTower = null;
      }
    }
  }
}

function spawnEnemies()
{
  if (currRound % 5 == 0){
    ui.roundText.setText(`Boss Wave`);
  }
  else{
    ui.roundText.setText(`Wave ${currRound}`);
  }
  ui.roundText.reset();
  ui.roundText.start();
  
  if (currRound % 5 == 0){
    let tile = startL;
    testEnemies.push(new Boss(tile.position.x + tile.w / 2 - (20), (tile.position.y + tile.w / 2), tile));
    tile = startR;
    testEnemies.push(new Boss(tile.position.x + tile.w / 2 + (20), (tile.position.y + tile.w / 2), tile));
  
  }

  for (let i = 1; i < enemyCount+1; i++)
  {
    let tile = startL;
    //test param
    testEnemies.push(new Enemy(tile.position.x + tile.w / 2 - ((i + 1) * 20), (tile.position.y + tile.w / 2), tile));
  }
  for (let i = 1; i < enemyCount+1; i++)
  {
    let tile = startR;
    //test param
    testEnemies.push(new Enemy(tile.position.x + tile.w / 2 + ((i + 1) * 20), (tile.position.y + tile.w / 2), tile));
  }
  enemyCount += 2;
  enemyCount = constrain(enemyCount, 10, 50);
  enemyBonusStats.speed += 0.01;
}

function startBuild()
{
  buildTimer = new Timer(30, true);
  buildTimer.start();
  ui.roundText.setText(`Build Phase`);
  ui.roundText.reset();
  ui.roundText.start();
}


function draw()
{
  background(0);
  image(gfx, 0, 0);
  noCursor();
  updatePlayers();
  // Tick over build clock for 1P Testing
  if (IsStarted)
  {

    canBuild = false;
    if (buildTimer && buildTimer.isTicking && towerToBuild >= -5)
    {
      buildTimer.tick();
      canBuild = true;
    }

    // Start next Enemy Wave
    if (buildTimer && buildTimer.isFinished && !buildTimerEndRequested)
    {
      // spawnEnemies(); // Single Player
      // buildTimer.reset(); // Single Player
      socket.emit("requestBuildTimerEnd");
      buildTimerEndRequested = true;
    }
    if (enemiesCanSpawn && !gameIsOver)
    {
      spawnEnemies();
      IsAttackPhase = true;
      enemiesCanSpawn = false;
      buildTimer.timerRequested = false;
      buildTimer.reset()
    }
    // gameMap.draw();

    // Collate enemies that have died and need removal
    let enemiesToRemove = [];
    for (let enemy of testEnemies)
    {
      enemy.draw();
      if (enemy.currentTile == enemy.goal)
      {
        enemiesToRemove.push(enemy);
        if (enemy.eType == "Boss"){
          lives -= 5;
        }
        else {
        lives -= 1;
        }
        playSound(sounds.damage);
      }
      if (enemy.hp <= 0)
      {
        if (enemy.killedBy == "p1"){
          if (enemy.eType == "Boss"){
          gold += 50;
          }
          else {
          gold += 5;
          }
          clientEnemiesKilled++;
        }
        enemiesToRemove.push(enemy);

      }
    }
    // Hacky Bullshit
    image(resources.caveSprites[1], gameMap.tileMap[11][0].position.x, gameMap.tileMap[11][0].position.y);
    push();
    imageMode(CENTER);
    translate(gameMap.tileMap[11][gameMap.cols - 1].position.x + 10, gameMap.tileMap[11][gameMap.cols - 1].position.y + 10);
    rotate(radians(180));
    image(resources.caveSprites[1], 0, 0);
    pop();

    if (lives <= 0 && !gameIsOver)
    {
      //end Game stuff
      socket.emit("gameOver", calculateScore(), currRound);
      gameIsOver = true;
      enemiesCanSpawn = false;
      canBuild = false;
    }

    // Check mouse v tower for buildability
    for (let tower of towers)
    {
      if (buildTimer && buildTimer.isTicking)
      {
        tower.checkMouse();
      }

      tower.draw();
    }

    // Stop tracking and remove dead enemies
    testEnemies = testEnemies.filter(item => !enemiesToRemove.includes(item));
    enemiesToRemove = [];
    if (testEnemies.length == 0 && buildTimer && !buildTimer.isTicking && IsAttackPhase)
    {
      // console.log("Requesting build timer start")
      gold += 50 * (floor(currRound / 10) + 1);
      playSound(sounds.gold);
      currRound += 1;
      // startBuild();
      socket.emit("requestBuildTimerStart");
      buildTimer.timerRequested = true;
      buildTimer.reset()
      // console.log("fuck everything")
      IsAttackPhase = false;
      buildTimerEndRequested = false;

    }
    //   if (testEnemies.length == 0 && buildTimer && !buildTimer.isTicking && !buildTimer.timerRequested)
    //   {
    //   console.log("Requesting build timer start")
    //   gold += 50 * (floor(currRound/10)+1);
    //   currRound += 1;
    //   // startBuild();
    //   socket.emit("requestBuildTimerStart");
    //     buildTimer.timerRequested = true;
    //     buildTimer.reset()
    // }

    // Remove Destroyed Towers
    towers = towers.filter(tower => tower.rank >= 0);

    //Display current tower's range
    if (selectedTower)
    {
      push();
      ellipseMode(CENTER);
      noFill();
      stroke(0, 255, 0, 128);
      circle(selectedTower.position.x, selectedTower.position.y, selectedTower.range * 2);
      pop();
    }
    fill(0);
    noStroke();
    // text(frameRate(), 10, 10);


    push();
    translate(goal.position.x - 20, goal.position.y - 20);
    //imageMode(CENTER);
    image(resources.base, 0, 0);
    pop();
    ui.draw();

    canBuild == true ? tint(0, 255, 0, 200) : tint(255, 0, 0, 200);
    // Display Range
    if (towerToBuild >= 0)
    {
      let tower;
      switch (towerToBuild)
      {
        case 0:
          tower = new Tower(0, 0, "", 0, 0, 0);
          break;
        case 1:
          tower = new Tower2(0, 0, "", 0, 0, 0);
          break;
        case 2:
          tower = new Tower3(0, 0, "", 0, 0, 0);
          break;
        case 3:
          tower = new Tower4(0, 0, "", 0, 0);
          break;
        default:
          break;
      }

      // Tower visuals -- Can be built or not
      if ((mouseX > 0 && mouseX < playWidth && mouseY > 0 && mouseY < playHeight) && (canBuild) && towerToBuild >= 0)
      {
        let currTile = gameMap.getTile(mouseX, mouseY)
        push();
        ellipseMode(CENTER);
        noFill();
        stroke(0, 255, 0, 128);
        circle(currTile.position.x + gameMap.tileWidth / 2, currTile.position.y + gameMap.tileWidth / 2, tower.range * 2);
        imageMode(CENTER);
        image(tower.sprite, currTile.position.x + gameMap.tileWidth / 2, currTile.position.y + gameMap.tileWidth / 2);
        pop();
      }

    }
    noTint();
    // Display Upgrade or Destroy
    towerToBuild == -1 ? image(resources.hammer, mouseX + resources.hammer.width / 4, mouseY - resources.hammer.height / 2) : null;
    towerToBuild == -2 ? image(resources.cross, mouseX + resources.cross.width / 4, mouseY - resources.cross.height / 2) : null;
    // Draw player 2 Mouse
    push();
    tint(0, 0, 68, 128);

    if (ui.nameBox.isEnabled)
    {
      ui.nameBox.draw();
    }
    // ui.gameOverBox.draw();
    // ui.gameOverBox.setResults([{ "score": 285, "name": "loop_daddy"}]);
    // ui.gameOverBox.setResults([{ "score": 285, "name": "loop_daddy" },{ "score": 327, "name": "dooper" }]);



    if (gameIsOver)
    {
      ui.gameOverBox.draw();
    }
    this.drawPlayer2Mouse();
    noTint();
    pop();
  }


  if (LoadingScreen.showing)
  {
    LoadingScreen.draw();
  }
  image(resources.cursor, mouseX, mouseY);
  onMouseHover();

}
function drawPlayer2Mouse()
{
  p2mousePosition.currX = (p2mousePosition.newX + p2mousePosition.oldX) / 2
  p2mousePosition.currY = (p2mousePosition.newY + p2mousePosition.oldY) / 2
  image(resources.cursor, p2mousePosition.currX, p2mousePosition.currY);
  p2mousePosition.oldX = p2mousePosition.newX
  p2mousePosition.oldY = p2mousePosition.newY
}
function playSound(sound)
{
  if (sound.playing())
  {
    sound.stop();
  }
  sound.play();
}
// function startLoadingAnimation()
// {
//   image(loadingGif, 0, 0, 1000, 580)
//   // loadingAnimation = false;
// }
function setupSocket()
{
  // socket = io('localhost:3001')
  socket = io()
  // socket = io('http://www.skelegame.com')
  socket.on("connect", () =>
  {
    socket.emit("clientConnection")
    // playersList.find(x => x.id == socketID).id = socket.id
    socketID = socket.id //save socketID because ID is lost if the socket disconnects. 
    checkCookieForLogin()

  })
  socket.on("gameInstanceID", (id) =>
  {
    randSeed = id;
    randomSeed(randSeed);
    gameMap.generate();
    startL = gameMap.tileMap[11][0];
    startR = gameMap.tileMap[11][gameMap.cols - 1];
    goal = gameMap.tileMap[15][15];
    for (let space of gameMap.tileMap)
    {
      for (let tile of space)
      {
        if (tile.r >= 14 && tile.r <= 16)
        {
          if (tile.c >= 14 && tile.c <= 16)
          {
            tile.outOfBounds = true;
          }
        }
      }
    }
    IsStarted = true

  })
  socket.on("newChatMessage", (data) =>
  {
    ui.chatBox.addRemoteChatMessage(data)
  })
  socket.on("greetPlayer", (name) =>
  {
    ui.chatBox.greetPlayer(name)
  })
  // //listen for incoming player data. update connected player
  // socket.on("playerData", (data) =>
  // {
  //     let playerData = JSON.parse(data)

  //     for (let i = 0; i < playerData.length; i++)
  //     {
  //         let updatePlayer = playersList.find(x => x.id == playerData[i].id)
  //         let index = playersList.indexOf(updatePlayer)
  //         if (index > -1)
  //         {
  //             playersList[index] = playerData[i]
  //         }
  //         else 
  //         {
  //             playersList.push(playerData[i])
  //         }
  //     }
  // })
  socket.on("playerDisconnected", (playerName) =>
  {
    if (playerName)
    {
    ui.chatBox.playerLeft(playerName);
    }
    // let deletePlayer = playersList.find(x => x.id == playerId)
    // let index = playersList.indexOf(deletePlayer)
    // playersList.splice(index, 1)
    // let deleteMouse = mouseList.find(x => x.id == playerId)
    // index = mouseList.indexOf(deleteMouse)
    // mouseList.splice(index,1)
    // console.log("player with id :" + playerId + " has been removed.")

  })
  // let intervalID
  socket.on("buildTimerStart", () =>
  {

    startBuild();

  })
  socket.on("newTower", (data) =>
  {
    let tower
    // console.log(data)
    switch (data.name)
    {
      case 'Magic Tower':
        tower = new Tower(data.x, data.y, 'p2', data.row, data.col, data.cost, data.id)
        break;
      case 'Poison Tower':
        tower = new Tower2(data.x, data.y, 'p2', data.row, data.col, data.cost, data.id)
        break;
      case 'Frost Tower':
        tower = new Tower3(data.x, data.y, 'p2', data.row, data.col, data.cost, data.id)
        break;
      case 'Flame Tower':
        tower = new Tower4(data.x, data.y, 'p2', data.row, data.col, data.cost, data.id)
        break;
      default:
        break;
    }
    gameMap.tileMap[tower.row][tower.col].isPathable = false;
    towers.push(tower);
  })
  socket.on("upgradeTower", (data) =>
  {
    // console.log(data)
    let tower = towers.find(x => x.id === data && x.owner === 'p2');
    tower.upgrade();
    // console.log(tower)
    ui.generateFloatingText(`Rank ???`, tower.position, color(0, 225, 0, 255));
  })
  socket.on("destroyTower", (data) =>
  {
    let tower = towers.find(x => x.id === data && x.owner == 'p2');
    tower.rank = -1;
    gameMap.tileMap[tower.row][tower.col].isPathable = true;
    // console.log(tower)
    // ui.generateFloatingText(`+${floor(tower.totalSpent / 2)} gold`, tower.position, color(255, 255, 0, 255));
  })
  socket.on("buildTimerEnd", () =>
  {
    enemiesCanSpawn = true;
    // buildTimerEndRequested = false;
    // spawnEnemies();
    // currRound += 1;
    // buildTimer.reset();


  })
  socket.on("serverMouseData", (data) =>
  {
    p2mousePosition.newX = data[0].mouseX
    p2mousePosition.newY = data[0].mouseY
    // for (let i = 0; i < mouseData.length; i++)
    // {
    //     let updateMouse = mouseList.find(x => x.id == mouseData[i].id)
    //     let index = mouseList.indexOf(updateMouse)
    //     if (index > -1)
    //     {
    //         mouseList[index] = mouseData[i]
    //     }
    //     else
    //     {
    //         mouseList.push(mouseData[i])
    //     }
    // }
  })
  socket.on("gameResults", (results, round) =>
  {
    ui.gameOverBox.setResults(results);
  })
  socket.on("waitingForPlayer",()=>
  {
    ui.chatBox.waitingForPlayer();
  });
  // function tickTimer()
  // {
  //     console.log(buildTimerLength)
  //     buildTimerLength--
  //     if (buildTimerLength == 0)
  //     {
  //         clearInterval(intervalID)
  //         buildTimerLength = 30
  //         buildPhaseOn = false
  //         socket.emit("requestBuildTimerEnd")
  //     }
  // }
  socket.on("requeue", () =>
  {
    restart();
    console.log("requeue")
  })
  socket.on("adminMessage",(string)=>{
    ui.chatBox.addAdminMessage(string);
  })
}

function userExists(cookie)
{
  return cookie.split(":").any(x => x.startsWith("name:"))

}

function updatePlayers()
{
  // if (currFrame++ % 2 == 0)
  // {
    updateConnectedPlayers()
    sendClientState()
  // }
}
function sendClientState()
{

  if (socket && socket.connected)
  {
    // let client = playersList.find(x => x.id == socketID|| x.id == 0)
    // let clientJSON = JSON.stringify(client)
    // console.log(JSON.stringify(client))
    // socket.emit("clientData", JSON.stringify(client))
    socket.emit("clientMouseData", { "mouseX": mouseX, "mouseY": mouseY, "id": socket.id })
    // let p1Towers = towers.filter(x => x.owner == 'p1');
    // if (p1Towers.length > 0)
    // {
    //   for (tower in p1Towers)
    //   {
    //     socket.
    //   }
    // }

    // console.log(clientJSON)

  }
}
function updateConnectedPlayers()
{
  // if (socket && socket.connected && currFrame % 2 == 0)
  // {
  //     socket.emit("requestUpdate")
  // }
  // if (playersList.length > 1)
  // {
  //     let connectedPlayers = playersList.filter(x => x.id != socketID)
  //     for (let i = 0; i < connectedPlayers.length; i++)
  //     {
  //         fill(255)
  //         circle(connectedPlayers[i].x, connectedPlayers[i].y, 20)
  //     }

  // }
}


function checkCookieForLogin()
{
  //delete cookie for testing purposes
  document.cookie = document.cookie + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";

  let cookie = document.cookie;
  playerName = getPlayerName(cookie)
  if (!playerName)
  {
    promptForName()
  }
  else
  {
    socket.emit("newPlayerJoined", playerName)
    socket.emit("requestBuildTimerStart")
    // buildTimer.timerRequested = true;

  }
}
function getPlayerName(cookie)
{
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
function promptForName()
{
  // let nameBox = select("#name_box_container")
  // nameBox.elt.style.visibility = "visible"
  // nameBox.elt.addEventListener("keydown", nameBoxListener)
  ui.nameBox.enable();
}
function nameBoxListener(e)
{
  switch (e.key)
  {
    case "Enter":
      let name = select("#name_text").elt.value.trim();
      if (name && name != "")
      {
        document.cookie = "name=" + name
        playerName = name
        this.style.visibility = "hidden"
        socket.emit("newPlayerJoined", name)
      }
      socket.emit("requestBuildTimerStart")
      // buildTimer.timerRequested = true;

      break;
    default:
      break;
  }
}
function disconnect()
{
  socket.disconnect();
}
function calculateScore()
{
  let maxRankTowers = towers.filter(x => x.rank === 10 && x.owner === "p1").length;
  return 10 * currRound + clientEnemiesKilled + gold + 2 * maxRankTowers;
}
class Player
{
  constructor(x, y)
  {
    this.x = x
    this.y = y
    this.id = 0
    this.name
  }
}
class ChatMessage
{
  constructor(name, text)
  {
    this.name = name;
    this.text = text;
  }
}
let timeoutID
document.addEventListener("visibilitychange", () =>
{
  if (document.hidden)
  {
    timeoutID = setTimeout(disconnect, 20000);
  }
  else
  {
    clearTimeout(timeoutID);
  }
})

