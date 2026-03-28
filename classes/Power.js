export default class Power {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 35; 
    this.height = 35;
    this.speed = 2; 
    this.markedForDeletion = false;
    
    this.angle = 0;
    this.spinSpeed = (Math.random() - 0.5) * 0.05; 
    
    this.rockVertices = [];
    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
      const radius = 12 + Math.random() * 8; 
      this.rockVertices.push(radius);
    }
  }

  update() {
    this.x -= this.speed; 
    this.angle += this.spinSpeed; 
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1a1a24"; 
    ctx.strokeStyle = "#445";  
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < this.rockVertices.length; i++) {
      const currentAngle = i * (Math.PI * 2 / this.rockVertices.length);
      const px = Math.cos(currentAngle) * this.rockVertices[i];
      const py = Math.sin(currentAngle) * this.rockVertices[i];
      
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.rotate(-this.angle); 

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff00"; 
    ctx.fillStyle = "#aaffaa";   

    ctx.beginPath();
    ctx.moveTo(0, -10); 
    ctx.lineTo(6, 0);   
    ctx.lineTo(0, 10);  
    ctx.lineTo(-6, 0);  
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}