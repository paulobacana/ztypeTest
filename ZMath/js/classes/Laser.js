export class Laser {
    constructor(x, y, tx, ty) {
        this.x = x;
        this.y = y;
        this.tx = tx;
        this.ty = ty;
        this.life = 10; // Duração em frames
    }

    draw(ctx) {
        if (this.life > 0) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.tx, this.ty);
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 2;
            ctx.stroke();
            this.life--;
        }
    }
}