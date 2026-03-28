import { drawArc } from "../utils.js";
export default class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.speed = 10;
    this.markedForDeletion = false;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    drawArc(ctx, centerX, centerY, this.width + 2, "#f00");
    drawArc(ctx, centerX, centerY, this.width, "#ff0");
  }
}
