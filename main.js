let animationId;
let resizeObserver;

const keys = {
  ArrowUp: false,
  KeyW: false,
  ArrowDown: false,
  KeyS: false,
  ArrowLeft: false,
  KeyD: false,
  ArrowRight: false,
  KeyA: false,
  Space: false,
  KeyX: false,
  KeyO: false,
};

function handleKeyDown(e) {
  keys[e.code] = true;
}

function handleKeyUp(e) {
  keys[e.code] = false;
}

function init() {
  let lasers = [];
  let enemies = [];
  let stars = [];
  let particles = [];
  let frames = 0;
  let gameState = "START";
  let highScore = localStorage.getItem("spaceShooterHighScore") || 0;

  const parentDiv = document.createElement("div");
  parentDiv.classList.add("canvas-container");
  document.body.appendChild(parentDiv);

  const uiContainer = document.createElement("div");
  uiContainer.classList.add("uiContainer");
  uiContainer.style.position = "absolute";
  uiContainer.style.inset = "0";
  uiContainer.style.display = "flex";
  uiContainer.style.justifyContent = "center";
  uiContainer.style.alignItems = "center";
  uiContainer.style.pointerEvents = "none";
  parentDiv.appendChild(uiContainer);

  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  parentDiv.appendChild(canvas);

  const startButton = document.createElement("button");
  const restartButton = document.createElement("button");
  startButton.classList.add("ui__start");
  restartButton.classList.add("ui__restart");
  startButton.innerText = "START";
  restartButton.innerText = "RESTART";
  startButton.style.display = "block";
  restartButton.style.display = "none";
  startButton.style.pointerEvents = "auto";
  restartButton.style.pointerEvents = "auto";
  uiContainer.appendChild(startButton);
  uiContainer.appendChild(restartButton);

  const ctx = canvas.getContext("2d");

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  for (let i = 0; i < 50; i++) {
    stars.push(
      new Star(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
      ),
    );
  }
  let player = new Player(100, 100);
  let score = new Score(200, 100);
  let life = new Life(300, 100);

  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      canvas.width = width;
      canvas.height = height;

      player.cWidth = width;
      player.cHeight = height;

      player.y = height / 2 - player.size / 2;

      score.x = canvas.width - 150;
      score.y = 30;

      life.x = canvas.width - 250;
      life.y = 30;
    }
  });
  resizeObserver.observe(parentDiv);

  function gameLoop() {
    frames++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(ctx, 0, 0, canvas.width, canvas.height, "#101040");
    stars.forEach((star) => {
      star.update();
      star.draw(ctx);

      if (star.x < 0) {
        star.x = canvas.width;
        star.y = Math.random() * canvas.height;
      }
    });

    particles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });
    particles = particles.filter((particle) => particle.alpha > 0);
    if (gameState === "PLAYING") {
      //updates:

      player.update(lasers);
      lasers.forEach((laser) => {
        laser.update();
      });
      if (frames % 60 === 0) {
        enemies.push(
          new Enemy(canvas.width - 30, Math.random() * (canvas.height - 30)),
        );
      }
      enemies.forEach((enemy) => {
        enemy.update();
      });

      //collisions
      enemies.forEach((enemy) => {
        lasers.forEach((laser) => {
          if (collisionDetection(enemy, laser)) {
            enemy.markedForDeletion = true;
            laser.markedForDeletion = true;
            score.score++;
            for (let i = 0; i < 15; i++) {
              particles.push(
                new Particle(
                  enemy.x + enemy.width / 2,
                  enemy.y + enemy.height / 2,
                ),
              );
            }
          }
        });
        if (collisionDetection(enemy, player)) {
          life.lives--;
          enemy.markedForDeletion = true;
          if (life.lives <= 0) {
            gameState = "OVER";
            startButton.style.display = "none";
            restartButton.style.display = "block";
            if (score.score > highScore) {
              highScore = score.score;
              localStorage.setItem("spaceShooterHighScore", highScore);
            }
          }
        }
      });

      //filtering only onscreen objects
      lasers = lasers.filter(
        (laser) => laser.x < canvas.width && !laser.markedForDeletion,
      );
      enemies = enemies.filter(
        (enemy) => enemy.x + enemy.width > 0 && !enemy.markedForDeletion,
      );

      //drawing

      player.draw(ctx);
      lasers.forEach((laser) => {
        laser.draw(ctx);
      });
      enemies.forEach((enemy) => {
        enemy.draw(ctx);
      });
      score.draw(ctx);
      life.draw(ctx);
    } else if (gameState === "START") {
      drawText(
        ctx,
        "Move using :  W, S, A, D, or Arrow keys. ",
        canvas.width / 2,
        canvas.height / 2,
      );
      drawText(
        ctx,
        " Shoot using : Space or O or X ",
        canvas.width / 2,
        canvas.height / 3,
      );
      drawText(
        ctx,
        `HighScore : ${highScore}`,
        canvas.width / 2,
        canvas.height / 4,
      );
    } else if (gameState === "OVER") {
      drawText(ctx, "GAME OVER", canvas.width / 2, canvas.height / 2);
    }

    animationId = requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  startButton.addEventListener("click", () => {
    gameState = "PLAYING";
    startButton.style.display = "none";
  });

  restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    gameState = "PLAYING";
    lasers = [];
    enemies = [];
    frames = 0;
    score.score = 0;
    life.lives = 3;
    player.x = 50;
    player.y = canvas.height / 2 - player.size / 2;
  });
}

class Player {
  constructor(cWidth, cHeight) {
    this.cWidth = cWidth;
    this.cHeight = cHeight;
    this.size = 40;
    this.speed = 5;
    this.gunWidth = 20;
    this.gunHeight = 10;
    this.width = this.size + this.gunWidth;
    this.height = this.size;

    this.x = 50;
    this.y = this.cHeight / 2 - this.size / 2;

    this.cooldown = 0;
  }

  update(lasers) {
    if (keys.ArrowUp || keys.KeyW) {
      this.y = this.y - this.speed;
    }
    if (keys.ArrowDown || keys.KeyS) {
      this.y = this.y + this.speed;
    }
    if (keys.ArrowLeft || keys.KeyA) {
      this.x = this.x - this.speed * 2;
    }
    if (keys.ArrowRight || keys.KeyD) {
      this.x = this.x + this.speed;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > this.cWidth - this.size - this.gunWidth) {
      this.x = this.cWidth - this.size - this.gunWidth;
    }
    if (this.y > this.cHeight - this.size) {
      this.y = this.cHeight - this.size;
    }

    if (this.cooldown > 0) {
      this.cooldown--;
    }

    if ((keys.Space || keys.KeyX || keys.KeyO) && this.cooldown === 0) {
      let gunTipX = this.x + this.size + this.gunWidth;
      let gunTipY = this.y + this.size / 2 - 5;
      lasers.push(new Laser(gunTipX, gunTipY));
      this.cooldown = 10;
    }
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.size, this.size, "#00f");
    drawRect(
      ctx,
      this.x + this.size,
      this.y + this.size / 2 - this.gunHeight / 2,
      this.gunWidth,
      this.gunHeight,
    );
  }
}

class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speed = 10;
    this.markedForDeletion = false;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, "#0f0");
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 7;
    this.markedForDeletion = false;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, "#f00");
  }
}

class Score {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
  }

  draw(ctx) {
    drawText(
      ctx,
      `SCORE : ${this.score}`,
      this.x,
      this.y,
      "16px",
      "#fff",
      "left",
    );
  }
}

class Life {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lives = 3;
  }

  draw(ctx) {
    drawText(
      ctx,
      `LIVES : ${this.lives}`,
      this.x,
      this.y,
      "16px",
      "#fff",
      "left",
    );
  }
}

class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.round(Math.random() * 2 + 1);
    this.speed = Math.round(Math.random() * 5 + 1);
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.size, this.size);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    };
    this.size = Math.random() * 10 + 1;
    this.alpha = 1;
    const colors = ["#ff0000", "#ff7700", "#ffff00"];
    // Pick a random color from the array every time a particle is created
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.02;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    drawRect(ctx, this.x, this.y, this.size, this.size, this.color);
    ctx.restore();
  }
}

function removeCanvasIP() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);

  resizeObserver?.disconnect();
}

function drawRect(ctx, x, y, width, height, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawText(
  ctx,
  text,
  x,
  y,
  size = "16px",
  color = "#fff",
  align = "center",
) {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function collisionDetection(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

init();
