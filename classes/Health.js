import { drawRect } from "../utils.js";

export default class Life {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.health = 100;
    this.width = 150;
    this.height = 15;
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, "#fff");
    let currentWidth = (this.health / this.maxHealth) * this.width;
    let paddingAdjustedWidth = Math.max(0, currentWidth - 4);

    if (this.health > 0) {
      drawRect(
        ctx,
        this.x + 2,
        this.y + 2,
        paddingAdjustedWidth,
        this.height - 4,
        "#0f0",
      );
    }
  }
}
