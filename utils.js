export function drawRect(ctx, x, y, width, height, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export function drawArc(ctx, x, y, radius, color = "#fff") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

export function drawText(
  ctx,
  text,
  x,
  y,
  size = "16px",
  color = "#fff",
  align = "center",
) {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

export function collisionDetection(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
