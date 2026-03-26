import { drawRect } from "../utils.js";
export default class Particle {
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