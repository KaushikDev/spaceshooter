import Star from "./classes/Star.js";
import Particle from "./classes/Particle.js";
import Health from "./classes/Health.js";
import Score from "./classes/Score.js";
import Enemy from "./classes/Enemy.js";
import Player from "./classes/Player.js";
import Power from "./classes/Power.js"; 
import { drawRect } from "./utils.js";
import { drawText } from "./utils.js";
import { collisionDetection } from "./utils.js";

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
  let powerUps = [];
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
  let health = new Health(300, 100);

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

      health.x = canvas.width / 2 - 75;
      health.y = 21;
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

      player.update(keys, lasers);
      lasers.forEach((laser) => {
        laser.update();
      });
      if (frames % 60 === 0) {
        enemies.push(
          new Enemy(canvas.width - 30, Math.random() * (canvas.height - 30)),
        );
      }
      enemies.forEach((enemy) => {
        enemy.update(player);
      });

      if (health.health < health.maxHealth && health.health > 0) {
        if (frames % 600 === 0) {
          powerUps.push(
            new Power(
              canvas.width,
              Math.random() * (canvas.height - 40),
            ),
          );
        }
      }

      powerUps.forEach((powerUp) => {
        powerUp.update();
      });

      enemies.forEach((enemy) => {
        lasers.forEach((laser) => {
          if (collisionDetection(enemy, laser)) {
            enemy.markedForDeletion = true;
            laser.markedForDeletion = true;
            score.score++;
            for (let i = 0; i < 100; i++) {
              particles.push(
                new Particle(
                  enemy.x + enemy.width / 2,
                  enemy.y + enemy.height / 2,
                ),
              );
            }
          }
        });

        // Player vs Enemy
        if (collisionDetection(enemy, player)) {
          health.health -= 20;
          enemy.markedForDeletion = true;

          for (let i = 0; i < 500; i++) {
            particles.push(
              new Particle(
                player.x + player.width / 2,
                player.y + player.height / 2,
              ),
            );
          }
          player.x = 50;
          player.y = canvas.height / 2 - player.size / 2;

          if (health.health <= 0) {
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

      powerUps.forEach((powerUp) => {
        if (collisionDetection(powerUp, player)) {
          powerUp.markedForDeletion = true;

          health.health = Math.min(health.maxHealth, health.health + 25);

          for (let i = 0; i < 20; i++) {
            let p = new Particle(
              powerUp.x + powerUp.width / 2,
              powerUp.y + powerUp.height / 2,
            );
            p.color = "#00ff00";
            particles.push(p);
          }
        }
      });

      lasers = lasers.filter(
        (laser) => laser.x < canvas.width && !laser.markedForDeletion,
      );
      enemies = enemies.filter(
        (enemy) => enemy.x + enemy.width > 0 && !enemy.markedForDeletion,
      );
      powerUps = powerUps.filter(
        (powerUp) =>
          powerUp.x + powerUp.width > 0 && !powerUp.markedForDeletion,
      );

      powerUps.forEach((powerUp) => powerUp.draw(ctx));
      player.draw(ctx);
      lasers.forEach((laser) => laser.draw(ctx));
      enemies.forEach((enemy) => enemy.draw(ctx));
      score.draw(ctx);
      health.draw(ctx);
    } else if (gameState === "START") {
      drawText(
        ctx,
        "SPACE SHOOTER",
        canvas.width / 2 + 4,
        canvas.height / 4 + 4,
        "50px",
        "red",
      );
      drawText(
        ctx,
        "SPACE SHOOTER",
        canvas.width / 2,
        canvas.height / 4,
        "50px",
        "yellow",
      );
      drawText(
        ctx,
        `HighScore ${highScore}`,
        canvas.width / 2,
        canvas.height / 3,
      );
      drawText(
        ctx,
        "Press ENTER to play",
        canvas.width / 2,
        canvas.height / 2.5,
      );
      drawText(
        ctx,
        "Move player with W S A D or Arrow keys",
        canvas.width / 2,
        canvas.height / 1.65,
      );
      drawText(
        ctx,
        " Shoot with SPACE or O or X key",
        canvas.width / 2,
        canvas.height / 1.45,
      );
    } else if (gameState === "OVER") {
      drawText(
        ctx,
        "SPACE SHOOTER",
        canvas.width / 2 + 4,
        canvas.height / 4 + 4,
        "50px",
        "red",
      );
      drawText(
        ctx,
        "SPACE SHOOTER",
        canvas.width / 2,
        canvas.height / 4,
        "50px",
        "yellow",
      );
      drawText(ctx, "GAME OVER", canvas.width / 2, canvas.height / 3);
      drawText(
        ctx,
        " Press ENTER to play again",
        canvas.width / 2,
        canvas.height / 2.5,
      );
      drawText(
        ctx,
        `Score ${score.score}`,
        canvas.width / 2,
        canvas.height / 1.65,
      );
      drawText(
        ctx,
        `HighScore ${highScore}`,
        canvas.width / 2,
        canvas.height / 1.45,
      );
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
    powerUps = [];
    frames = 0;
    score.score = 0;
    health.health = health.maxHealth;
    player.x = 50;
    player.y = canvas.height / 2 - player.size / 2;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (gameState === "START") {
        startButton.click();
      } else if (gameState === "OVER") {
        restartButton.click();
      }
    }
  });
}

function removeCanvasIP() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);

  resizeObserver?.disconnect();
}

init();
