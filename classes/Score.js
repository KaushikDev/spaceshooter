import { drawText } from "../utils.js";

export default class Score {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
  }

  draw(ctx) {
    drawText(
      ctx,
      `SCORE : ${this.score}`,
      this.x,
      this.y,
      "16px",
      "#fff",
      "left",
    );
  }
}
