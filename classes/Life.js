import { drawText } from "../utils.js";

export default class Life {
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