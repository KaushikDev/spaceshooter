import { drawRect } from "../utils.js";

export default class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 3 + Math.random() * 2;
    this.vx = 0;
    this.vy = 0;
    this.markedForDeletion = false;
    this.angleTrajectory = 0;
  }

  update(player) {
    let distX = player.x - this.x;
    let distY = player.y - this.y;

    this.angleTrajectory = Math.atan2(distY, distX);
    this.vx = this.speed * Math.cos(this.angleTrajectory);
    this.vy = this.speed * Math.sin(this.angleTrajectory);

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angleTrajectory + Math.PI);

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0033";

    ctx.fillStyle = "#0a0000";
    ctx.strokeStyle = "#ff0033";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(0, -6);
    ctx.lineTo(-12, -18);
    ctx.lineTo(15, -12);
    ctx.lineTo(10, 0);
    ctx.lineTo(15, 12);
    ctx.lineTo(-12, 18);
    ctx.lineTo(0, 6);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = "#ffaa00";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();

    let coreSize = 3 + Math.random() * 2;
    ctx.arc(2, 0, coreSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
