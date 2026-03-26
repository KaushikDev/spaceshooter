import { drawRect } from "./../utils.js";
export default class Star {
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
