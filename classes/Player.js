import { drawRect } from "../utils.js";
import Laser from "./Laser.js";
export default class Player {
  constructor(cWidth, cHeight) {
    this.cWidth = cWidth;
    this.cHeight = cHeight;
    this.size = 40;
    this.speed = 5;
    this.gunWidth = 20;
    this.gunHeight = 10;
    this.width = this.size + this.gunWidth;
    this.height = this.size;

    this.x = 50;
    this.y = this.cHeight / 2 - this.size / 2;

    this.cooldown = 0;
  }

  update(keys, lasers) {
    if (keys.ArrowUp || keys.KeyW) {
      this.y = this.y - this.speed;
    }
    if (keys.ArrowDown || keys.KeyS) {
      this.y = this.y + this.speed;
    }
    if (keys.ArrowLeft || keys.KeyA) {
      this.x = this.x - this.speed * 2;
    }
    if (keys.ArrowRight || keys.KeyD) {
      this.x = this.x + this.speed;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > this.cWidth - this.size - this.gunWidth) {
      this.x = this.cWidth - this.size - this.gunWidth;
    }
    if (this.y > this.cHeight - this.size) {
      this.y = this.cHeight - this.size;
    }

    if (this.cooldown > 0) {
      this.cooldown--;
    }

    if ((keys.Space || keys.KeyX || keys.KeyO) && this.cooldown === 0) {
      let gunTipX = this.x + this.size + this.gunWidth;
      let gunTipY = this.y + this.size / 2 - 5;
      lasers.push(new Laser(gunTipX, gunTipY));
      this.cooldown = 10;
    }
  }

  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.size, this.size, "#00f");
    drawRect(
      ctx,
      this.x + this.size,
      this.y + this.size / 2 - this.gunHeight / 2,
      this.gunWidth,
      this.gunHeight,
    );
  }
}