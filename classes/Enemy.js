import { drawRect } from "../utils.js";

export default class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 4;
    this.vx = 0;
    this.vy = 0;
    this.markedForDeletion = false;
  }

  update(player) {
    let distX = player.x - this.x;
    let distY = player.y - this.y;

    let angleTrajectory = Math.atan2(distY, distX);
    this.vx = this.speed * Math.cos(angleTrajectory);
    this.vy = this.speed * Math.sin(angleTrajectory);

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, "#f00");
  }
}
