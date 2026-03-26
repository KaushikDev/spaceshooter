import {drawArc } from "../utils.js";
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
    drawArc(ctx, this.x, this.y, this.width+2, "#f00");
    drawArc(ctx, this.x, this.y, this.width, "#ff0");
  }
}
