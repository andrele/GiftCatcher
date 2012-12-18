

// Falling object types
var ENEMY_TYPE_PRESENT = 1;
var ENEMY_TYPE_SNOWBALL = 2;
var ENEMY_TYPE_HP = 3;

var game = {
  canvas_width: window.innerWidth,
  canvas_height: window.innerHeight,
  fps: 30,
  enemy_spawn_rate: 0.5,
  enemy_amplitude_multiplier: 3,
  enemy_vertical_velocity: 10,
  interval: 0,
  highscore: 0,
  timelimit: 45,
  time: 0,
  floor: window.innerHeight - 450,
  area_width: 10
};

var player = {
  color: "#00A",
  x: 50,
  y: game.floor,
  width: 350,
  height: 400,
  collision_x_offset: 0,
  collision_y_offset: 150,
  score: 0,
  lives: 3,
  distance: 0,
  prev_height: 0,
  draw: function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
};

var playerBullets = [];

var scoreBoard = {
  fontSize: 48,
  fontFace: "Mountains of Christmas",
  fontFamily: "cursive",
  fontWeight: 700,
  fillStyle: "#035903",
  text: "Hello World!",
  x: 0,
  y: 70,
  draw: function() {
    canvas.font ='normal ' + fontWeight + ' ' + fontSize + 'px ' + "'" + fontFace + "'";
    canvas.fillText(text, 10, y);
  }
};

// Projectile object

function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= game.game.canvas_width &&
      I.y >= 0 && I.y <= game.game.canvas_height;
  };

  I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    this.active = false;
    // Extra Credit: Add an explosion graphic
  };

  return I;
};

// Initialize enemies array
enemies = [];

// Enemy object
function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);
  // I.type = Math.floor(Math.random() * 2 + 1);

  var randomType = Math.random();

  if (randomType < .7) {
    I.type = ENEMY_TYPE_PRESENT;
  } else if (randomType >= .7 && randomType <= .9){
    I.type = ENEMY_TYPE_SNOWBALL;
  } else {
    I.type = ENEMY_TYPE_HP;
  };

  switch (I.type){
    case ENEMY_TYPE_SNOWBALL:
      I.sprite = Sprite("small_snowball");
      break;
    case ENEMY_TYPE_HP:
      I.sprite = Sprite("hplogo");
      break;
    default:
      I.sprite = Sprite("present"); 
  };
  I.color = "#A2B";

  I.x = game.canvas_width / 4 + Math.random() * game.canvas_width / 2;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = Math.random()*game.enemy_vertical_velocity + 5;

  I.width = 82;
  I.height = 82;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= game.canvas_width &&
      I.y >= 0 && I.y <= game.canvas_height;
  };



  I.draw = function() {
    this.sprite.draw(canvas, this.x, this.y);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.xVelocity = game.enemy_amplitude_multiplier * Math.sin(I.age * Math.PI / 64);

    I.age++;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    this.active = false;
    // Extra Credit: Add an explosion graphic
  };

  return I;
};

// Draw the canvas

var canvasElement = $("<canvas id='playground' width='" + game.canvas_width +
  "' height='" + game.canvas_height + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

var overlayElement = $("<canvas id='overlay' width='" + game.canvas_width +
  "' height='" + game.canvas_height + "'></canvas>");
var overlay = overlayElement.get(0).getContext("2d");
overlayElement.appendTo('body');

function startGame(){
  game.time = game.timelimit*game.fps;
  game.interval = setInterval(function() {
    update();
    draw();
  }, 1000/game.fps);
};

function stopGame(){
  clearInterval(game.interval);
  Sound.play("applause");
  $("#overlay").drawRect({
      layer: true,
      name: "dimmer",
      group: "gameover",
      fillStyle: "rgba(0,0,0,0.5)",
      opacity: 1,
      width: game.canvas_width,
      height: game.canvas_height,
      fromCenter: false,
      click: function() {resetGame();}
    }).drawText({
      layer: true,
      name: "gameovertext",
      group: "gameover",
      fillStyle: "#FFF",
      opacity: 1,
      x: (game.canvas_width/2), y: (game.canvas_height/2),
      font: 'normal ' + scoreBoard.fontWeight + ' 100px ' + "'" + scoreBoard.fontFace + "'",
      text: "Great job!"
    }).drawText({
      layer: true,
      name: "clicktorestart",
      group: "gameover",
      fillStyle: "#FFF",
      opacity: 1,
      x: (game.canvas_width/2),
      y: (game.canvas_height/2 + 100),
      font: 'normal ' + scoreBoard.fontWeight + ' 50px ' + "'" + scoreBoard.fontFace + "'",
      text: "Click to restart"
  });
};

function resetGame(){

  $("#overlay").removeLayerGroup("gameover").clearCanvas();
  player.score = 0;
  player.distance = 0;
  enemies = [];
  startGame();


};

// Game loop updater. Checks for keypresses, handles collisions, and adds enemies to screen

function update() {
  if(keydown.left) {
    player.x -= 15;
  }

  if(keydown.right) {
    player.x += 15;
  }

  game.time--;

  if (game.time <= 0){
    stopGame();
  }

  player.x = player.x.clamp(0, game.canvas_width - player.width);

  playerBullets.forEach(function(bullet) {
    bullet.update();
  });

  playerBullets = playerBullets.filter(function(bullet) {
    return bullet.active;
  });

  enemies.forEach(function(enemy) {
    enemy.update();
  });

  enemies = enemies.filter(function(enemy) {
    return enemy.active;
  });

  handleCollisions();

  // Enemy Spawning!
  if(Math.random() < (game.enemy_spawn_rate/game.fps)) {
    enemies.push(Enemy());
  }
};

player.shoot = function() {
  Sound.play("shoot");

  var bulletPosition = this.midpoint();

  playerBullets.push(Bullet({
    speed: 5,
    x: bulletPosition.x,
    y: bulletPosition.y
  }));
};

player.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

function draw() {
  //canvas.clearRect(0, 0, game.canvas_width, game.canvas_height);
  $("#playground").clearCanvas();

  scoreBoard.draw();

  player.draw();

  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });

  enemies.forEach(function(enemy) {
    enemy.draw();
  });
};

function collides(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width - b.collision_x_offset > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height - b.collision_y_offset > b.y;
};

function handleCollisions() {

  // Check to see if bullets collide with enemies
  playerBullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if(collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
      }
    });
  });

  // Check to see if any enemies hit player
  enemies.forEach(function(enemy) {
    if(collides(enemy, player)) {

      switch (enemy.type){
        case ENEMY_TYPE_SNOWBALL:
          Sound.play("crow");
          player.changeScore(-1);
          break;
        case ENEMY_TYPE_HP:
          Sound.play("powerup");
          player.changeScore(10);
          break;
        default:
          Sound.play("whip");
          player.changeScore(1);
      }
      enemy.explode();
      player.explode();

    }
  });
};

player.changeScore = function(change) {
  var scoreChange = change;
  var score_x_offset = 250;
  var score_y_offset = 100;
  this.score += scoreChange;

  if (scoreChange > 0){
    var text = '+' + scoreChange;
    if (this.score > game.highscore) {game.highscore = this.score; text = '+' + scoreChange + ' New Record!'};
    $("#overlay").drawText({
      layer: true,
      group: "scoreIndicator",
      fillStyle: "#007300",
      x: player.x + score_x_offset, y: player.y + score_y_offset,
      font: 'normal ' + scoreBoard.fontWeight + ' 100px ' + "'" + scoreBoard.fontFace + "'",
      text: text
    }).animateLayer({
      scale: "+=1",
      fillStyle: "rgba(0,0,0,0)"
    }, 400, "swing", function() {$("#overlay").removeLayerGroup("scoreIndicator");});

  }else{
    $("#overlay").drawText({
      layer: true,
      group: "scoreIndicator",
      fillStyle: "#b80010",
      x: player.x + score_x_offset, y: player.y + score_y_offset,
      font: 'normal ' + scoreBoard.fontWeight + ' 100px ' + "'" + scoreBoard.fontFace + "'",
      text: scoreChange
    }).animateLayer({
      scale: "+=1",
      fillStyle: "rgba(0,0,0,0)",
    }, 400, "swing", function() {$("#overlay").removeLayerGroup("scoreIndicator");});
  }
};

player.explode = function() {
  this.active = false;
  // Extra Credit: Add an explosion graphic and then end the game
};

scoreBoard.draw = function() {
    var text = 'HIGHSCORE: ' + game.highscore;
    canvas.fillStyle = scoreBoard.fillStyle;
    canvas.font = 'normal ' + scoreBoard.fontWeight + ' ' + scoreBoard.fontSize + 'px ' + "'" + scoreBoard.fontFace + "'";
    canvas.fillText(text,30,scoreBoard.y);
    text = 'SCORE: ' + player.score;
    canvas.fillText(text,30,scoreBoard.y + 50);
    text = 'TIME LEFT: ' + Math.floor(game.time/game.fps) + ' seconds';
    canvas.fillText(text,window.innerWidth-450,scoreBoard.y);
    text = 'DISTANCE: ' + Math.floor((player.distance/300)) + 'ft';
    canvas.fillText(text, window.innerWidth-450,scoreBoard.y + 50); 
};

player.sprite = Sprite("player");
player.shadow = Sprite("player_shadow");

player.draw = function() {
  this.sprite.draw(canvas, this.x, this.y);
  this.shadow.draw(canvas, this.x + 65, game.floor + 380);
};

startGame();

