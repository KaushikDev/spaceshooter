import { drawRect } from "../utils.js";

export default class Enemy {
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
