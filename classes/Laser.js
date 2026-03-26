import { drawRect } from "../utils.js";
export default class Laser {
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
