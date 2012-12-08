var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 960;
var FPS = 30;
var ENEMY_SPAWN_RATE = 1;

var player = {
  color: "#00A",
  x: 50,
  y: 600,
  width: 20,
  height: 30,
  draw: function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
};

var playerBullets = [];

var background = {
  color: "#00A",
  x: 0,
  y: 0,
  width: 700,
  height: 509,
  draw: function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
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
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
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
}

// Initialize enemies array
enemies = [];

// Enemy object
function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);

  I.color = "#A2B";

  I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = 2;

  I.width = 82;
  I.height = 82;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.sprite = Sprite("present");

  I.draw = function() {
    this.sprite.draw(canvas, this.x, this.y);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

    I.age++;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    Sound.play("whip");

    this.active = false;
    // Extra Credit: Add an explosion graphic
  };

  return I;
};

// Draw the canvas

var canvasElement = $("<canvas id='playground' width='" + CANVAS_WIDTH +
  "' height='" + CANVAS_HEIGHT + "'></canvas");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

setInterval(function() {
  update();
  draw();
}, 1000/FPS);

// Game loop updater. Checks for keypresses, handles collisions, and adds enemies to screen

function update() {
  if(keydown.space) {
    player.shoot();
  }

  if(keydown.left) {
    player.x -= 15;
  }

  if(keydown.right) {
    player.x += 15;
  }



  player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);

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
  if(Math.random() < (ENEMY_SPAWN_RATE/FPS)) {
    enemies.push(Enemy());
  }
}

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
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();

  background.draw();

  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });

  enemies.forEach(function(enemy) {
    enemy.draw();
  });
}

function collides(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function handleCollisions() {
  playerBullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if(collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
      }
    });
  });

  enemies.forEach(function(enemy) {
    if(collides(enemy, player)) {
      enemy.explode();
      player.explode();
    }
  });
}

player.explode = function() {
  this.active = false;
  // Extra Credit: Add an explosion graphic and then end the game
};

player.sprite = Sprite("stocking");

player.draw = function() {
  this.sprite.draw(canvas, this.x, this.y);
};

background.sprite = Sprite("background");

background.draw = function() {
  this.sprite.draw(canvas, 0, 0);
};
