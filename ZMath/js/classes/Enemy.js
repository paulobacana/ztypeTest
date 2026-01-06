import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class Enemy {
    constructor(text, answer) {
        this.x = Math.random() * (CANVAS_WIDTH - 100) + 50;
        this.y = -30;
        this.text = text;
        this.answer = answer;
        this.isRightAnswer = false;
        this.speed = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speed;
        return this.y > CANVAS_HEIGHT; // Retorna true se passou da tela
    }

    draw(ctx) {
        ctx.font = "20px Courier New";
        
        // Desenha Nave
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 10, this.y - 20);
        ctx.lineTo(this.x + 10, this.y - 20);
        ctx.fillStyle = '#2ed573';
        ctx.fill();

        // Desenha Texto
        ctx.fillStyle = '#fff';
        const textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - (textWidth / 2), this.y + 20);
        

    }
}